package com.ecetdesk.api.auth;

import com.ecetdesk.api.user.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class FirstAdminBootstrap implements CommandLineRunner {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final String email;
    private final String password;
    private final String displayName;

    public FirstAdminBootstrap(UserRepository users, PasswordEncoder encoder,
            @Value("${app.bootstrap.admin.email:}") String email,
            @Value("${app.bootstrap.admin.password:}") String password,
            @Value("${app.bootstrap.admin.display-name:}") String displayName) {
        this.users = users;
        this.encoder = encoder;
        this.email = email;
        this.password = password;
        this.displayName = displayName;
    }

    @Override
    public void run(String... args) {
        if (email.isBlank() && password.isBlank() && displayName.isBlank()) return;
        if (email.isBlank() || password.isBlank() || displayName.isBlank()) {
            throw new IllegalStateException("Set BOOTSTRAP_ADMIN_EMAIL, BOOTSTRAP_ADMIN_PASSWORD and BOOTSTRAP_ADMIN_NAME together.");
        }
        if (password.length() < 12) {
            throw new IllegalStateException("BOOTSTRAP_ADMIN_PASSWORD must contain at least 12 characters.");
        }
        if (!users.existsByRole(UserRole.ADMIN)) {
            if (users.existsByEmailIgnoreCase(email)) {
                throw new IllegalStateException("Bootstrap admin email already belongs to a non-admin account.");
            }
            users.save(new UserAccount(email, encoder.encode(password), displayName, UserRole.ADMIN));
        }
    }
}
