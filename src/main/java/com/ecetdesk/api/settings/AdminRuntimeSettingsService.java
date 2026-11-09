package com.ecetdesk.api.settings;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminRuntimeSettingsService {
    private static final String DEFAULT_MODEL = "openrouter/free";
    private final JdbcTemplate jdbc;
    private final String environmentApiKey;
    private final String environmentBrevoApiKey;
    private final String environmentModel;
    private final SecretKeySpec encryptionKey;

    public AdminRuntimeSettingsService(JdbcTemplate jdbc,
            @Value("${app.ai.openrouter.api-key:}") String environmentApiKey,
            @Value("${app.ai.openrouter.model:}") String environmentModel,
            @Value("${app.mail.brevo.api-key:}") String environmentBrevoApiKey,
            @Value("${app.security.settings-encryption-key-base64:}") String encryptionSecret) {
        this.jdbc = jdbc;
        this.environmentApiKey = environmentApiKey == null ? "" : environmentApiKey.trim();
        this.environmentBrevoApiKey = environmentBrevoApiKey == null ? "" : environmentBrevoApiKey.trim();
        this.environmentModel = environmentModel == null || environmentModel.isBlank()
                ? DEFAULT_MODEL : environmentModel.trim();
        if (encryptionSecret == null || encryptionSecret.isBlank()) {
            this.encryptionKey = null;
        } else {
            try {
                byte[] key = Base64.getDecoder().decode(encryptionSecret.trim());
                if (key.length != 32) throw new IllegalArgumentException("Expected exactly 32 decoded bytes.");
                this.encryptionKey = new SecretKeySpec(key, "AES");
            } catch (IllegalArgumentException ex) {
                throw new IllegalStateException("SETTINGS_ENCRYPTION_KEY_BASE64 must be a valid Base64-encoded 32-byte key.", ex);
            }
        }
    }

    public record RuntimeConfig(String apiKey, String model) {}
    public record BrevoRuntimeConfig(String apiKey) {}

    public Map<String, Object> getSettings() {
        String encrypted = findValue("openrouter.api-key");
        String model = findValue("openrouter.model");
        String encryptedBrevo = findValue("brevo.api-key");
        boolean dashboardKey = encrypted != null && !encrypted.isBlank();
        boolean environmentKey = !environmentApiKey.isBlank();
        boolean dashboardBrevoKey = encryptedBrevo != null && !encryptedBrevo.isBlank();
        boolean environmentBrevoKey = !environmentBrevoApiKey.isBlank();
        return Map.ofEntries(
                Map.entry("provider", "OpenRouter"),
                Map.entry("apiKeyConfigured", dashboardKey || environmentKey),
                Map.entry("apiKeySource", dashboardKey ? "Admin dashboard" : environmentKey ? "Environment" : "Not configured"),
                Map.entry("model", model == null || model.isBlank() ? environmentModel : model),
                Map.entry("modelSource", model == null || model.isBlank() ? "Environment/default" : "Admin dashboard"),
                Map.entry("brevoApiKeyConfigured", dashboardBrevoKey || environmentBrevoKey),
                Map.entry("brevoApiKeySource", dashboardBrevoKey ? "Admin dashboard" : environmentBrevoKey ? "Environment" : "Not configured"),
                Map.entry("encryptionKeyConfigured", encryptionKey != null),
                Map.entry("restartRequired", false)
        );
    }

    public RuntimeConfig getRuntimeConfig() {
        String encrypted = findValue("openrouter.api-key");
        String model = findValue("openrouter.model");
        String key = encrypted == null || encrypted.isBlank()
                ? environmentApiKey : decrypt(encrypted);
        return new RuntimeConfig(key, model == null || model.isBlank() ? environmentModel : model);
    }

    public BrevoRuntimeConfig getBrevoRuntimeConfig() {
        String encrypted = findValue("brevo.api-key");
        String key = encrypted == null || encrypted.isBlank()
                ? environmentBrevoApiKey : decrypt(encrypted);
        return new BrevoRuntimeConfig(key);
    }

    @Transactional
    public void update(String apiKey, boolean clearApiKey, String model,
            String brevoApiKey, boolean clearBrevoApiKey, String adminEmail) {
        if (clearApiKey) {
            jdbc.update("DELETE FROM app.admin_runtime_settings WHERE setting_key='openrouter.api-key'");
        } else if (apiKey != null && !apiKey.isBlank()) {
            requireEncryptionKey();
            save("openrouter.api-key", encrypt(apiKey.trim()), adminEmail);
        }
        if (clearBrevoApiKey) {
            jdbc.update("DELETE FROM app.admin_runtime_settings WHERE setting_key='brevo.api-key'");
        } else if (brevoApiKey != null && !brevoApiKey.isBlank()) {
            requireEncryptionKey();
            save("brevo.api-key", encrypt(brevoApiKey.trim()), adminEmail);
        }
        if (model != null && !model.isBlank()) {
            String normalized = model.trim();
            if (!normalized.matches("[a-zA-Z0-9._/-]{3,120}")) {
                throw new IllegalArgumentException("Model identifier contains unsupported characters.");
            }
            save("openrouter.model", normalized, adminEmail);
        }
    }

    private String findValue(String key) {
        List<String> values = jdbc.query(
                "SELECT setting_value FROM app.admin_runtime_settings WHERE setting_key=?",
                (rs, row) -> rs.getString(1), key);
        return values.isEmpty() ? null : values.get(0);
    }

    private void save(String key, String value, String adminEmail) {
        jdbc.update("""
                INSERT INTO app.admin_runtime_settings(setting_key, setting_value, updated_at, updated_by)
                VALUES (?, ?, CURRENT_TIMESTAMP, ?)
                ON CONFLICT (setting_key) DO UPDATE SET setting_value=EXCLUDED.setting_value,
                    updated_at=CURRENT_TIMESTAMP, updated_by=EXCLUDED.updated_by
                """, key, value, adminEmail);
    }

    private void requireEncryptionKey() {
        if (encryptionKey == null) {
            throw new IllegalStateException("Configure SETTINGS_ENCRYPTION_KEY_BASE64 with a dedicated Base64-encoded 32-byte key before saving an API key.");
        }
    }

    private String encrypt(String value) {
        try {
            byte[] nonce = new byte[12];
            new SecureRandom().nextBytes(nonce);
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.ENCRYPT_MODE, encryptionKey, new GCMParameterSpec(128, nonce));
            byte[] ciphertext = cipher.doFinal(value.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(
                    ByteBuffer.allocate(nonce.length + ciphertext.length).put(nonce).put(ciphertext).array());
        } catch (Exception ex) {
            throw new IllegalStateException("Could not encrypt the API key.", ex);
        }
    }

    private String decrypt(String value) {
        requireEncryptionKey();
        try {
            byte[] packed = Base64.getDecoder().decode(value);
            ByteBuffer buffer = ByteBuffer.wrap(packed);
            byte[] nonce = new byte[12];
            buffer.get(nonce);
            byte[] ciphertext = new byte[buffer.remaining()];
            buffer.get(ciphertext);
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.DECRYPT_MODE, encryptionKey, new GCMParameterSpec(128, nonce));
            return new String(cipher.doFinal(ciphertext), StandardCharsets.UTF_8);
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to decrypt a saved API key. Verify SETTINGS_ENCRYPTION_KEY_BASE64.", ex);
        }
    }
}
