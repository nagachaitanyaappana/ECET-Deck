package com.ecetdesk.api.settings;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminRuntimeSettingsService {
    private static final String DEFAULT_MODEL = "openai/gpt-4o-mini";
    private final JdbcTemplate jdbc;
    private final SecretKeySpec encryptionKey;
    private final String environmentApiKey;
    private final String environmentModel;

    public AdminRuntimeSettingsService(JdbcTemplate jdbc,
            @Value("${app.security.jwt.secret-base64}") String jwtSecret,
            @Value("${app.ai.openrouter.api-key:}") String environmentApiKey,
            @Value("${app.ai.openrouter.model:openai/gpt-4o-mini}") String environmentModel) throws Exception {
        this.jdbc = jdbc;
        this.environmentApiKey = environmentApiKey == null ? "" : environmentApiKey;
        this.environmentModel = environmentModel == null || environmentModel.isBlank() ? DEFAULT_MODEL : environmentModel;
        byte[] secret = Base64.getDecoder().decode(jwtSecret);
        this.encryptionKey = new SecretKeySpec(MessageDigest.getInstance("SHA-256").digest(secret), "AES");
    }

    public String getApiKey() {
        String encrypted = jdbc.query("SELECT encrypted_value FROM admin_runtime_settings WHERE setting_key='openrouter_api_key'",
            rs -> rs.next() ? rs.getString(1) : null);
        if (encrypted == null || encrypted.isBlank()) return environmentApiKey;
        try {
            byte[] packed = Base64.getDecoder().decode(encrypted);
            ByteBuffer buffer = ByteBuffer.wrap(packed);
            byte[] nonce = new byte[12]; buffer.get(nonce);
            byte[] ciphertext = new byte[buffer.remaining()]; buffer.get(ciphertext);
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.DECRYPT_MODE, encryptionKey, new GCMParameterSpec(128, nonce));
            return new String(cipher.doFinal(ciphertext), StandardCharsets.UTF_8);
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to decrypt the stored AI provider key. Check the JWT secret configuration.", ex);
        }
    }

    public String getModel() {
        String value = jdbc.query("SELECT encrypted_value FROM admin_runtime_settings WHERE setting_key='openrouter_model'",
            rs -> rs.next() ? rs.getString(1) : null);
        return value == null || value.isBlank() ? environmentModel : value;
    }

    public java.util.Map<String,Object> getSettings() {
        boolean configured = !getApiKey().isBlank();
        Integer overrideCount = jdbc.queryForObject(
            "SELECT COUNT(*) FROM admin_runtime_settings WHERE setting_key='openrouter_api_key'",
            Integer.class);
        String source = overrideCount != null && overrideCount > 0 ? "Dashboard"
            : (configured ? "Environment" : "Not configured");
        return java.util.Map.of("provider", "OpenRouter", "apiKeyConfigured", configured,
            "apiKeySource", source, "model", getModel(), "restartRequired", false);
    }

    @Transactional
    public void update(String apiKey, boolean clearApiKey, String model, String adminEmail) {
        if (clearApiKey) {
            jdbc.update("DELETE FROM admin_runtime_settings WHERE setting_key='openrouter_api_key'");
        } else if (apiKey != null && !apiKey.isBlank()) {
            try {
                byte[] nonce = new byte[12]; new java.security.SecureRandom().nextBytes(nonce);
                Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
                cipher.init(Cipher.ENCRYPT_MODE, encryptionKey, new GCMParameterSpec(128, nonce));
                byte[] encrypted = cipher.doFinal(apiKey.trim().getBytes(StandardCharsets.UTF_8));
                ByteBuffer packed = ByteBuffer.allocate(nonce.length + encrypted.length).put(nonce).put(encrypted);
                save("openrouter_api_key", Base64.getEncoder().encodeToString(packed.array()), adminEmail);
            } catch (Exception ex) {
                throw new IllegalStateException("Could not encrypt the provider key.", ex);
            }
        }
        if (model != null && !model.isBlank()) {
            if (!model.matches("[a-zA-Z0-9._/-]{3,120}")) throw new IllegalArgumentException("Model identifier contains unsupported characters.");
            save("openrouter_model", model.trim(), adminEmail);
        }
    }

    private void save(String key, String value, String adminEmail) {
        jdbc.update("""
            INSERT INTO admin_runtime_settings(setting_key,encrypted_value,updated_at,updated_by)
            VALUES (?,?,CURRENT_TIMESTAMP,?)
            ON CONFLICT (setting_key) DO UPDATE SET encrypted_value=EXCLUDED.encrypted_value,
              updated_at=CURRENT_TIMESTAMP, updated_by=EXCLUDED.updated_by
            """, key, value, adminEmail);
    }
}
