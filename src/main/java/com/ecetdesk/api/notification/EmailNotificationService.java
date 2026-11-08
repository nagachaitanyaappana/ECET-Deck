package com.ecetdesk.api.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService {
    private static final Logger log = LoggerFactory.getLogger(EmailNotificationService.class);

    private final JavaMailSender mailSender;
    private final String recipientEmail;
    private final String fromEmail;

    public EmailNotificationService(
            JavaMailSender mailSender,
            @Value("${app.admin.notification-email:paradoxofficial2008@gmail.com}") String recipientEmail,
            @Value("${app.mail.from:}") String fromEmail) {
        this.mailSender = mailSender;
        this.recipientEmail = recipientEmail == null ? "" : recipientEmail.trim();
        this.fromEmail = fromEmail == null ? "" : fromEmail.trim();
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
        if (fromEmail.isBlank() || recipientEmail.isBlank()) {
            log.warn("Email notification was not sent because MAIL_FROM or the admin notification recipient is not configured.");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(recipientEmail);
            message.setReplyTo(replyTo);
            message.setSubject(subject);
            message.setText(content);
            mailSender.send(message);
            log.info("Email notification sent to {} for: {}", recipientEmail, subject);
        } catch (Exception ex) {
            log.error("Failed to send email notification to {} for: {}", recipientEmail, subject, ex);
        }
    }
}
