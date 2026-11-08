package com.ecetdesk.api.settings;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
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
    private final JdbcTemplate jdbc;
    private final String envApiKey;
    private final String envModel;
    private final SecretKeySpec encryptionKey;

    public AdminRuntimeSettingsService(JdbcTemplate jdbc,
            @Value("${app.ai.openrouter.api-key:}") String envApiKey,
            @Value("${app.ai.openrouter.model:openai/gpt-4o-mini}") String envModel,
            @Value("${app.security.jwt.secret-base64:}") String jwtSecret) {
        this.jdbc = jdbc;
        this.envApiKey = envApiKey;
        this.envModel = envModel == null || envModel.isBlank() ? "openai/gpt-4o-mini" : envModel;
        try {
            byte[] material = jwtSecret.isBlank() ? "local-development-only-change-jwt-secret".getBytes(StandardCharsets.UTF_8) : Base64.getDecoder().decode(jwtSecret);
            this.encryptionKey = new SecretKeySpec(MessageDigest.getInstance("SHA-256").digest(material), "AES");
        } catch (Exception ex) { throw new IllegalStateException("Unable to initialize settings encryption", ex); }
    }

    public record SettingsView(boolean apiKeyConfigured, String apiKeySource, String model, String modelSource) {}
    public record RuntimeConfig(String apiKey, String model) {}

    public SettingsView getSettings() {
        boolean override = jdbc.queryForList("SELECT setting_value FROM app.admin_runtime_settings WHERE setting_key='openrouter.api-key'").size() > 0;
        String model = jdbc.query("SELECT setting_value FROM app.admin_runtime_settings WHERE setting_key='openrouter.model'",
            (rs, row) -> rs.getString(1)).stream().findFirst().orElse(envModel);
        return new SettingsView(override || (envApiKey != null && !envApiKey.isBlank()),
            override ? "Admin dashboard" : (envApiKey == null || envApiKey.isBlank() ? "Not configured" : "Environment"),
            model, model.equals(envModel) ? "Environment/default" : "Admin dashboard");
    }

    public RuntimeConfig getRuntimeConfig() {
        String encrypted = jdbc.query("SELECT setting_value FROM app.admin_runtime_settings WHERE setting_key='openrouter.api-key'",
            (rs, row) -> rs.getString(1)).stream().findFirst().orElse(null);
        String model = jdbc.query("SELECT setting_value FROM app.admin_runtime_settings WHERE setting_key='openrouter.model'",
            (rs, row) -> rs.getString(1)).stream().findFirst().orElse(envModel);
        return new RuntimeConfig(encrypted == null ? envApiKey : decrypt(encrypted), model);
    }

    @Transactional
    public SettingsView update(String apiKey, boolean clearApiKey, String model) {
        if (clearApiKey) {
            jdbc.update("DELETE FROM app.admin_runtime_settings WHERE setting_key='openrouter.api-key'");
        } else if (apiKey != null && !apiKey.isBlank()) {
            jdbc.update("""
                INSERT INTO app.admin_runtime_settings(setting_key, setting_value) VALUES ('openrouter.api-key', ?)
                ON CONFLICT(setting_key) DO UPDATE SET setting_value=EXCLUDED.setting_value, updated_at=NOW()
                """, encrypt(apiKey.trim()));
        }
        if (model != null && !model.isBlank()) {
            jdbc.update("""
                INSERT INTO app.admin_runtime_settings(setting_key, setting_value) VALUES ('openrouter.model', ?)
                ON CONFLICT(setting_key) DO UPDATE SET setting_value=EXCLUDED.setting_value, updated_at=NOW()
                """, model.trim());
        }
        return getSettings();
    }

    private String encrypt(String value) {
        try {
            byte[] iv = new byte[12]; new SecureRandom().nextBytes(iv);
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.ENCRYPT_MODE, encryptionKey, new GCMParameterSpec(128, iv));
            byte[] encrypted = cipher.doFinal(value.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(ByteBuffer.allocate(iv.length + encrypted.length).put(iv).put(encrypted).array());
        } catch (Exception ex) { throw new IllegalStateException("Could not encrypt API key", ex); }
    }

    private String decrypt(String value) {
        try {
            byte[] all = Base64.getDecoder().decode(value);
            ByteBuffer buffer = ByteBuffer.wrap(all); byte[] iv = new byte[12]; buffer.get(iv);
            byte[] encrypted = new byte[buffer.remaining()]; buffer.get(encrypted);
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.DECRYPT_MODE, encryptionKey, new GCMParameterSpec(128, iv));
            return new String(cipher.doFinal(encrypted), StandardCharsets.UTF_8);
        } catch (Exception ex) { throw new IllegalStateException("Could not decrypt stored API key; verify JWT secret has not changed", ex); }
    }
}
