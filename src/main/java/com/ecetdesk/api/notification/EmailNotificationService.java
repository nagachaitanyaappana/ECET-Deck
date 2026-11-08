package com.ecetdesk.api.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService {
    private static final Logger log = LoggerFactory.getLogger(EmailNotificationService.class);
    private final BrevoEmailService email;
    private final String recipientEmail;

    public EmailNotificationService(BrevoEmailService email,
            @Value("${app.admin.notification-email:paradoxofficial2008@gmail.com}") String recipientEmail) {
        this.email = email;
        this.recipientEmail = recipientEmail == null ? "" : recipientEmail.trim();
    }

    public void sendGrandTestRequestNotification(String studentName, String studentEmail, String note) {
        String subject = "[Paradox ECET Deck] Grand Test requested by " + studentName;
        String content = """
            A student has requested a Grand Test.

            Student: %s
            Email: %s
            Test: 200-question Grand Test (180 minutes)

            Student readiness note / topic focus:
            %s

            Open the Paradox ECET Deck admin panel to review and fulfil this request.
            """.formatted(studentName, studentEmail,
                (note == null || note.isBlank()) ? "Standard full syllabus" : note);
        sendEmail(subject, content, studentEmail);
    }

    public void sendFeedbackNotification(String studentName, String studentEmail,
            String category, String subject, String message) {
        String emailSubject = "[Paradox ECET Deck Feedback] " + category + ": " + subject;
        String content = """
            From: %s (%s)
            Category: %s
            Subject: %s

            Detailed message:
            %s
            """.formatted(studentName, studentEmail, category, subject, message);
        sendEmail(emailSubject, content, studentEmail);
    }

    private void sendEmail(String subject, String content, String replyTo) {
        if (recipientEmail.isBlank()) {
            log.warn("Email notification skipped because ADMIN_NOTIFICATION_EMAIL is not configured.");
            return;
        }
        try {
            email.send(recipientEmail, subject, content, replyTo);
            log.info("Admin email notification accepted by Brevo for: {}", subject);
        } catch (Exception ex) {
            log.error("Failed to send admin notification for: {}", subject, ex);
        }
    }
}
