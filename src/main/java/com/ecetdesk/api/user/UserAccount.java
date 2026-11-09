package com.ecetdesk.api.user;

import java.time.Instant;
import java.util.UUID;

public class UserAccount {
    private UUID id;
    private String email;
    private String passwordHash;
    private String displayName;
    private UserRole role;
    private boolean enabled = true;
    private boolean emailVerified = true;
    private Instant createdAt;
    private Instant updatedAt;

    public UserAccount() {}

    public UserAccount(String email, String passwordHash, String displayName, UserRole role) {
        this(email, passwordHash, displayName, role, true);
    }

    public UserAccount(String email, String passwordHash, String displayName, UserRole role, boolean emailVerified) {
        this.email = email != null ? email.trim().toLowerCase() : null;
        this.passwordHash = passwordHash;
        this.displayName = displayName != null ? displayName.trim() : null;
        this.role = role;
        this.emailVerified = emailVerified;
    }

    public UserAccount(UUID id, String email, String passwordHash, String displayName, UserRole role,
                       boolean enabled, boolean emailVerified, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.email = email != null ? email.trim().toLowerCase() : null;
        this.passwordHash = passwordHash;
        this.displayName = displayName != null ? displayName.trim() : null;
        this.role = role;
        this.enabled = enabled;
        this.emailVerified = emailVerified;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public String getDisplayName() { return displayName; }
    public UserRole getRole() { return role; }
    public boolean isEnabled() { return enabled; }
    public boolean isEmailVerified() { return emailVerified; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
