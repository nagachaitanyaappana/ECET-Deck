ALTER TABLE app.users
    ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT TRUE;

CREATE TABLE app.auth_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES app.users(id) ON DELETE CASCADE,
    purpose VARCHAR(24) NOT NULL,
    code_hash VARCHAR(100) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    last_sent_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    consumed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_auth_challenge_purpose CHECK (purpose IN ('EMAIL_VERIFY', 'LOGIN_OTP', 'PASSWORD_RESET')),
    CONSTRAINT chk_auth_challenge_attempts CHECK (attempts >= 0)
);

CREATE INDEX idx_auth_challenges_user_purpose_created
    ON app.auth_challenges(user_id, purpose, created_at DESC);

CREATE INDEX idx_auth_challenges_expiry
    ON app.auth_challenges(expires_at)
    WHERE consumed_at IS NULL;
