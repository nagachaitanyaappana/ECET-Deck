package com.ecetdesk.api.notification;

import java.time.Duration;
import java.util.List;
import java.util.Map;

import com.ecetdesk.api.settings.AdminRuntimeSettingsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

/** Sends transactional messages through Brevo's HTTPS API (works on hosts that block SMTP). */
@Service
public class BrevoEmailService {
    private static final Logger log = LoggerFactory.getLogger(BrevoEmailService.class);
    private final RestClient client;
    private final AdminRuntimeSettingsService settings;
    private final String senderEmail;
    private final String senderName;

    public BrevoEmailService(AdminRuntimeSettingsService settings,
            @Value("${app.mail.brevo.sender-email:}") String senderEmail,
            @Value("${app.mail.brevo.sender-name:Paradox}") String senderName) {
        this.settings = settings;
        this.senderEmail = senderEmail == null ? "" : senderEmail.trim();
        this.senderName = senderName == null || senderName.isBlank() ? "Paradox" : senderName.trim();
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(10));
        factory.setReadTimeout(Duration.ofSeconds(20));
        this.client = RestClient.builder().baseUrl("https://api.brevo.com/v3").requestFactory(factory).build();
    }

    public void send(String recipient, String subject, String text, String replyTo) {
        var config = settings.getBrevoRuntimeConfig();
        if (config.apiKey() == null || config.apiKey().isBlank()) {
            throw new IllegalStateException("Brevo is not configured. Add its API key in Admin Server Settings or BREVO_API_KEY in the server environment.");
        }
        if (senderEmail.isBlank()) {
            throw new IllegalStateException("Brevo sender is not configured. Set BREVO_SENDER_EMAIL in the server environment.");
        }
        Map<String, Object> body = new java.util.LinkedHashMap<>();
        body.put("sender", Map.of("name", senderName, "email", senderEmail));
        body.put("to", List.of(Map.of("email", recipient)));
        body.put("subject", subject);
        body.put("textContent", text);
        if (replyTo != null && !replyTo.isBlank()) body.put("replyTo", Map.of("email", replyTo));
        try {
            client.post().uri("/smtp/email")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("api-key", config.apiKey())
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();
            log.info("Transactional email accepted by Brevo for recipient {}", recipient);
        } catch (Exception ex) {
            log.error("Brevo transactional email request failed for recipient {}", recipient, ex);
            throw new IllegalStateException("Brevo could not send the email. Check the sender verification, account approval, and API key.", ex);
        }
    }
}
