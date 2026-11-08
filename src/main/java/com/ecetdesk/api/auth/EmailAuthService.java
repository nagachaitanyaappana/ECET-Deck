package com.ecetdesk.api.auth;

import com.ecetdesk.api.notification.BrevoEmailService;
import com.ecetdesk.api.user.UserAccount;
import com.ecetdesk.api.user.UserRepository;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmailAuthService {
    private static final Logger log = LoggerFactory.getLogger(EmailAuthService.class);
    private static final SecureRandom RANDOM = new SecureRandom();

    public record IssueResult(String code, boolean emailDelivered, String deliveryError) {}
    private final JdbcTemplate jdbc;
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final BrevoEmailService email;
    private final int expiryMinutes;
    private final int resendSeconds;
    private final boolean loginNotifications;

    public EmailAuthService(JdbcTemplate jdbc, UserRepository users, PasswordEncoder encoder,
            BrevoEmailService email,
            @Value("${app.auth.otp-expiry-minutes:10}") int expiryMinutes,
            @Value("${app.auth.otp-resend-seconds:60}") int resendSeconds,
            @Value("${app.auth.login-notifications-enabled:true}") boolean loginNotifications) {
        this.jdbc=jdbc; this.users=users; this.encoder=encoder; this.email=email;
        this.expiryMinutes=Math.max(3, Math.min(expiryMinutes, 30));
        this.resendSeconds=Math.max(30, Math.min(resendSeconds, 600));
        this.loginNotifications=loginNotifications;
    }

    @Transactional
    public IssueResult issue(UUID userId, String recipient, String displayName, String purpose) {
        Integer recentlySent = jdbc.queryForObject("""
            SELECT COUNT(*) FROM app.auth_challenges
            WHERE user_id=? AND purpose=? AND created_at > CURRENT_TIMESTAMP - (? * INTERVAL '1 second')
            """, Integer.class, userId, purpose, resendSeconds);
        if (recentlySent != null && recentlySent > 0)
            throw new AuthFlowException("Please wait before requesting another code.", 429);
        jdbc.update("UPDATE app.auth_challenges SET consumed_at=CURRENT_TIMESTAMP WHERE user_id=? AND purpose=? AND consumed_at IS NULL",
                userId, purpose);
        String code=String.format("%06d", RANDOM.nextInt(1_000_000));
        jdbc.update("""
            INSERT INTO app.auth_challenges(id,user_id,purpose,code_hash,expires_at,last_sent_at)
            VALUES (?,?,?,?,CURRENT_TIMESTAMP + (? * INTERVAL '1 minute'),CURRENT_TIMESTAMP)
            """, UUID.randomUUID(), userId, purpose, encoder.encode(code), expiryMinutes);
        
        boolean delivered = false;
        String deliveryError = null;
        try {
            send(recipient, displayName, purpose, code);
            delivered = true;
        } catch (Exception ex) {
            deliveryError = ex.getMessage();
            log.warn("Failed to deliver {} email to {}. Cause: {}", purpose, recipient, ex.getMessage());
        }
        return new IssueResult(code, delivered, deliveryError);
    }

    @Transactional
    public void verify(UUID userId, String purpose, String code) {
        List<Map<String,Object>> rows=jdbc.queryForList("""
            SELECT id,code_hash,expires_at,attempts FROM app.auth_challenges
            WHERE user_id=? AND purpose=? AND consumed_at IS NULL
            ORDER BY created_at DESC LIMIT 1 FOR UPDATE
            """, userId, purpose);
        if(rows.isEmpty()) throw new AuthFlowException("The code is invalid or has expired.", 400);
        Map<String,Object> row=rows.get(0);
        UUID id=(UUID)row.get("id");
        Object expiryValue=row.get("expires_at");
        Instant expires=expiryValue instanceof java.time.OffsetDateTime offset
                ? offset.toInstant() : ((java.sql.Timestamp)expiryValue).toInstant();
        int attempts=((Number)row.get("attempts")).intValue();
        if(!expires.isAfter(Instant.now()) || attempts>=5) {
            jdbc.update("UPDATE app.auth_challenges SET consumed_at=CURRENT_TIMESTAMP WHERE id=?",id);
            throw new AuthFlowException("The code is invalid or has expired. Request a new one.",400);
        }
        if(!encoder.matches(code,(String)row.get("code_hash"))) {
            jdbc.update("UPDATE app.auth_challenges SET attempts=attempts+1 WHERE id=?",id);
            throw new AuthFlowException("The code is incorrect.",400);
        }
        jdbc.update("UPDATE app.auth_challenges SET consumed_at=CURRENT_TIMESTAMP WHERE id=?",id);
    }

    public void markEmailVerified(UUID userId) {
        jdbc.update("UPDATE app.users SET email_verified=TRUE WHERE id=?",userId);
    }

    public void changePassword(UUID userId, String encodedPassword) {
        jdbc.update("UPDATE app.users SET password_hash=? WHERE id=?",encodedPassword,userId);
    }

    public void notifyLogin(UserAccount account) {
        if(loginNotifications) {
            try {
                email.send(account.getEmail(), "New sign-in to Paradox ECET Deck",
                    "Hello " + account.getDisplayName() + ",\n\nA sign-in to your Paradox ECET Deck account was completed. If this wasn't you, reset your password immediately.", null);
            } catch (Exception ex) {
                log.warn("Failed to deliver login notification to {}: {}", account.getEmail(), ex.getMessage());
            }
        }
    }

    private void send(String recipient,String name,String purpose,String code) {
        String subject; String action;
        switch(purpose) {
            case "EMAIL_VERIFY" -> { subject="Verify your Paradox ECET Deck email"; action="verify your email address"; }
            case "LOGIN_OTP" -> { subject="Your Paradox ECET Deck sign-in code"; action="complete your sign-in"; }
            case "PASSWORD_RESET" -> { subject="Reset your Paradox ECET Deck password"; action="reset your password"; }
            default -> throw new IllegalArgumentException("Unknown authentication challenge purpose");
        }
        email.send(recipient, subject, "Hello " + name + ",\n\nYour code to " + action + " is: " + code
            + "\n\nThis code expires in " + expiryMinutes + " minutes and can be used only once. If you did not request this, you can ignore this email.", null);
    }
}
