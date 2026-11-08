package com.ecetdesk.api.request;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.ecetdesk.api.assessment.AssessmentController;
import com.ecetdesk.api.assessment.AssessmentService;
import com.ecetdesk.api.notification.EmailNotificationService;

@Service
public class GrandTestRequestService {
    private final JdbcTemplate jdbc;
    private final AssessmentService assessmentService;
    private final EmailNotificationService emailService;

    public GrandTestRequestService(JdbcTemplate jdbc, AssessmentService assessmentService,
                                   EmailNotificationService emailService) {
        this.jdbc = jdbc;
        this.assessmentService = assessmentService;
        this.emailService = emailService;
    }

    public Map<String, Object> createRequest(String studentEmail, GrandTestRequestController.CreateRequestPayload payload) {
        Map<String, Object> student = jdbc.queryForMap(
            "SELECT id, display_name FROM users WHERE lower(email)=lower(?)", studentEmail);
        UUID studentId = (UUID) student.get("id");
        String studentName = (String) student.get("display_name");

        Integer pendingCount = jdbc.queryForObject(
            "SELECT COUNT(*) FROM grand_test_requests WHERE student_id=? AND status='PENDING'",
            Integer.class, studentId);
        if (pendingCount != null && pendingCount > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                "You already have an active pending Grand Test request. The admin will generate it soon.");
        }

        UUID id = UUID.randomUUID();
        String note = payload != null && payload.note() != null ? payload.note().trim() : null;
        jdbc.update(
            "INSERT INTO grand_test_requests(id, student_id, status, note) VALUES (?, ?, 'PENDING', ?)",
            id, studentId, note
        );

        // Dispatch email notification to paradoxofficial2008@gmail.com
        CompletableFuture.runAsync(() ->
            emailService.sendGrandTestRequestNotification(studentName, studentEmail, note));

        return Map.of(
            "id", id,
            "status", "PENDING",
            "note", note == null ? "" : note,
            "message", "Grand Test request sent! Email notification dispatched to paradoxofficial2008@gmail.com."
        );
    }

    public List<Map<String, Object>> getMyRequests(String studentEmail) {
        UUID studentId = jdbc.queryForObject("SELECT id FROM users WHERE lower(email)=lower(?)", UUID.class, studentEmail);
        return jdbc.queryForList("""
            SELECT r.id, r.status, r.note, r.generated_test_id AS "generatedTestId",
                   t.title AS "generatedTestTitle",
                   r.created_at AS "createdAt", r.resolved_at AS "resolvedAt"
            FROM grand_test_requests r
            LEFT JOIN tests t ON t.id = r.generated_test_id
            WHERE r.student_id = ?
            ORDER BY r.created_at DESC
            """, studentId);
    }

    public List<Map<String, Object>> listAllForAdmin() {
        return jdbc.queryForList("""
            SELECT r.id, r.status, r.note, r.generated_test_id AS "generatedTestId",
                   t.title AS "generatedTestTitle",
                   u.display_name AS "studentName", u.email AS "studentEmail",
                   r.created_at AS "createdAt", r.resolved_at AS "resolvedAt"
            FROM grand_test_requests r
            JOIN users u ON u.id = r.student_id
            LEFT JOIN tests t ON t.id = r.generated_test_id
            ORDER BY CASE WHEN r.status = 'PENDING' THEN 0 ELSE 1 END, r.created_at DESC
            """);
    }

    public Map<String, Object> fulfillRequest(UUID requestId, GrandTestRequestController.FulfillPayload payload, String adminEmail) {
        UUID adminId = jdbc.queryForObject("SELECT id FROM users WHERE lower(email)=lower(?)", UUID.class, adminEmail);

        Map<String, Object> req;
        try {
            req = jdbc.queryForMap("SELECT id, status, note, student_id FROM grand_test_requests WHERE id=?", requestId);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found.");
        }

        if (!"PENDING".equals(req.get("status"))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This request is already resolved.");
        }

        UUID testId = payload != null ? payload.testId() : null;
        String testTitle;

        if (payload != null && payload.autoGenerate()) {
            String instructions = payload.instructions();
            if ((instructions == null || instructions.isBlank()) && req.get("note") != null) {
                instructions = (String) req.get("note");
            }
            var genReq = new AssessmentController.AutoGenerateTestRequest(
                "GRAND",
                instructions,
                null,
                payload.customTitle()
            );
            Map<String, Object> genResult = assessmentService.autoGenerateTest(genReq, adminEmail);
            testId = (UUID) genResult.get("id");
            testTitle = (String) genResult.get("title");
        } else {
            if (testId == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Either set autoGenerate to true or provide a testId.");
            }
            try {
                testTitle = jdbc.queryForObject("SELECT title FROM tests WHERE id=?", String.class, testId);
            } catch (Exception ex) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Specified test does not exist.");
            }
        }

        jdbc.update("""
            UPDATE grand_test_requests
            SET status='FULFILLED', generated_test_id=?, resolved_at=CURRENT_TIMESTAMP, resolved_by=?
            WHERE id=?
            """, testId, adminId, requestId);

        return Map.of(
            "id", requestId,
            "status", "FULFILLED",
            "testId", testId,
            "testTitle", testTitle != null ? testTitle : "",
            "message", "Grand Test generated and request fulfilled!"
        );
    }

    public Map<String, Object> dismissRequest(UUID requestId, String adminEmail) {
        UUID adminId = jdbc.queryForObject("SELECT id FROM users WHERE lower(email)=lower(?)", UUID.class, adminEmail);
        int rows = jdbc.update("""
            UPDATE grand_test_requests
            SET status='DISMISSED', resolved_at=CURRENT_TIMESTAMP, resolved_by=?
            WHERE id=? AND status='PENDING'
            """, adminId, requestId);
        if (rows == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pending request not found.");
        }
        return Map.of("id", requestId, "status", "DISMISSED");
    }
}
