package com.ecetdesk.api.notification;

import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class EmailNotificationService {
    private static final Logger log = LoggerFactory.getLogger(EmailNotificationService.class);
    private final RestClient client;
    private final String recipientEmail;

    public EmailNotificationService(
            @Value("${app.admin.notification-email:paradoxofficial2008@gmail.com}") String recipientEmail) {
        this.recipientEmail = recipientEmail;
        this.client = RestClient.builder().baseUrl("https://formsubmit.co").build();
    }

    public void sendGrandTestRequestNotification(String studentName, String studentEmail, String note) {
        String subject = "[ECET Desk] Grand Test Requested by " + studentName;
        String content = """
            Student: %s (%s)
            Event: Requested 200-question Grand Test (180 mins)
            
            Student Readiness Note / Topic Focus:
            %s
            
            Access ECET Desk Admin Center to auto-generate the test:
            http://localhost:3000/
            """.formatted(studentName, studentEmail, (note == null || note.isBlank()) ? "Standard full syllabus" : note);

        sendEmail(subject, content, studentEmail);
    }

    public void sendFeedbackNotification(String studentName, String studentEmail, String category, String subject, String message) {
        String emailSubject = "[ECET Desk Feedback] " + category + ": " + subject;
        String content = """
            From: %s (%s)
            Category: %s
            Subject: %s
            
            Detailed Message:
            %s
            """.formatted(studentName, studentEmail, category, subject, message);

        sendEmail(emailSubject, content, studentEmail);
    }

    private void sendEmail(String subject, String content, String replyTo) {
        try {
            Map<String, Object> body = Map.of(
                "subject", subject,
                "message", content,
                "reply_to", replyTo,
                "_subject", subject
            );

            client.post()
                .uri("/ajax/" + recipientEmail)
                .header("Content-Type", "application/json")
                .header("Referer", "https://ecetdesk.com/notification")
                .header("Origin", "https://ecetdesk.com")
                .body(body)
                .retrieve()
                .toBodilessEntity();
            log.info("Email notification dispatched to {} for: {}", recipientEmail, subject);
        } catch (Exception ex) {
            log.warn("Failed to dispatch email notification to {}: {}", recipientEmail, ex.getMessage());
        }
    }
}
