package com.ecetdesk.api.feedback;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.ecetdesk.api.notification.EmailNotificationService;

@Service
public class FeedbackService {
    private final JdbcTemplate jdbc;
    private final EmailNotificationService emailService;

    public FeedbackService(JdbcTemplate jdbc, EmailNotificationService emailService) {
        this.jdbc = jdbc;
        this.emailService = emailService;
    }

    public Map<String, Object> submitFeedback(String userEmail, FeedbackController.CreateFeedbackRequest request) {
        Map<String, Object> user = jdbc.queryForMap(
            "SELECT id, display_name FROM users WHERE lower(email)=lower(?)", userEmail);
        UUID userId = (UUID) user.get("id");
        String userName = (String) user.get("display_name");

        UUID id = UUID.randomUUID();
        String rawCat = request.category() == null || request.category().isBlank()
            ? "GENERAL"
            : request.category().trim().toUpperCase(Locale.ROOT);
        final String category = Set.of("GENERAL", "QUESTION_ERROR", "FEATURE_REQUEST", "BUG").contains(rawCat)
            ? rawCat
            : "GENERAL";

        jdbc.update("""
            INSERT INTO feedbacks(id, user_id, category, subject, message, status)
            VALUES (?, ?, ?, ?, ?, 'OPEN')
            """, id, userId, category, request.subject().trim(), request.message().trim());

        // Dispatch email notification to paradoxofficial2008@gmail.com
        CompletableFuture.runAsync(() ->
            emailService.sendFeedbackNotification(
                userName, userEmail, category, request.subject().trim(), request.message().trim()));

        return Map.of(
            "id", id,
            "category", category,
            "subject", request.subject().trim(),
            "status", "OPEN",
            "message", "Feedback submitted! Email notification dispatched to paradoxofficial2008@gmail.com."
        );
    }

    public List<Map<String, Object>> getMyFeedbacks(String userEmail) {
        UUID userId = jdbc.queryForObject("SELECT id FROM users WHERE lower(email)=lower(?)", UUID.class, userEmail);
        return jdbc.queryForList("""
            SELECT id, category, subject, message, status, admin_notes AS "adminNotes",
                   created_at AS "createdAt", resolved_at AS "resolvedAt"
            FROM feedbacks
            WHERE user_id = ?
            ORDER BY created_at DESC
            """, userId);
    }

    public List<Map<String, Object>> listAllForAdmin() {
        return jdbc.queryForList("""
            SELECT f.id, f.category, f.subject, f.message, f.status, f.admin_notes AS "adminNotes",
                   u.display_name AS "userName", u.email AS "userEmail",
                   f.created_at AS "createdAt", f.resolved_at AS "resolvedAt"
            FROM feedbacks f
            JOIN users u ON u.id = f.user_id
            ORDER BY CASE WHEN f.status = 'OPEN' THEN 0 WHEN f.status = 'REVIEWED' THEN 1 ELSE 2 END, f.created_at DESC
            """);
    }

    public Map<String, Object> updateStatus(UUID feedbackId, FeedbackController.UpdateStatusRequest request) {
        String status = request.status().trim().toUpperCase(Locale.ROOT);
        if (!Set.of("OPEN", "REVIEWED", "RESOLVED").contains(status)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status must be OPEN, REVIEWED, or RESOLVED.");
        }
        int rows = jdbc.update("""
            UPDATE feedbacks
            SET status = ?, admin_notes = ?,
                resolved_at = CASE WHEN ? = 'RESOLVED' THEN CURRENT_TIMESTAMP ELSE resolved_at END
            WHERE id = ?
            """, status, request.adminNotes(), status, feedbackId);
        if (rows == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Feedback not found.");
        }
        return Map.of("id", feedbackId, "status", status);
    }
}
