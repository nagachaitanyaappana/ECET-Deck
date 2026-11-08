CREATE TABLE admin_runtime_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    encrypted_value TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255)
);
INSERT INTO admin_runtime_settings(setting_key, encrypted_value)
VALUES ('openrouter_model', NULL)
ON CONFLICT (setting_key) DO NOTHING;
