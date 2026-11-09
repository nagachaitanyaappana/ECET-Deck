package com.ecetdesk.api.user;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class JdbcUserRepository implements UserRepository {
    private final JdbcTemplate jdbc;
    private final RowMapper<UserAccount> rowMapper = this::mapRow;

    public JdbcUserRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private UserAccount mapRow(ResultSet rs, int rowNum) throws SQLException {
        Timestamp createdAt = rs.getTimestamp("created_at");
        Timestamp updatedAt = rs.getTimestamp("updated_at");
        return new UserAccount(
            rs.getObject("id", UUID.class),
            rs.getString("email"),
            rs.getString("password_hash"),
            rs.getString("display_name"),
            UserRole.valueOf(rs.getString("role")),
            rs.getBoolean("enabled"),
            rs.getBoolean("email_verified"),
            createdAt != null ? createdAt.toInstant() : null,
            updatedAt != null ? updatedAt.toInstant() : null
        );
    }

    @Override
    public UserAccount save(UserAccount user) {
        if (user.getId() == null) {
            UUID id = UUID.randomUUID();
            user.setId(id);
            jdbc.update("""
                INSERT INTO app.users (id, email, password_hash, display_name, role, enabled, email_verified, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                """,
                id,
                user.getEmail() != null ? user.getEmail().trim().toLowerCase() : null,
                user.getPasswordHash(),
                user.getDisplayName(),
                user.getRole().name(),
                user.isEnabled(),
                user.isEmailVerified()
            );
            return user;
        } else {
            jdbc.update("""
                UPDATE app.users
                SET email = ?, password_hash = ?, display_name = ?, role = ?, enabled = ?, email_verified = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
                """,
                user.getEmail() != null ? user.getEmail().trim().toLowerCase() : null,
                user.getPasswordHash(),
                user.getDisplayName(),
                user.getRole().name(),
                user.isEnabled(),
                user.isEmailVerified(),
                user.getId()
            );
            return user;
        }
    }

    @Override
    public Optional<UserAccount> findById(UUID id) {
        List<UserAccount> results = jdbc.query("SELECT * FROM app.users WHERE id = ?", rowMapper, id);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    @Override
    public Optional<UserAccount> findByEmailIgnoreCase(String email) {
        if (email == null || email.isBlank()) return Optional.empty();
        List<UserAccount> results = jdbc.query(
            "SELECT * FROM app.users WHERE LOWER(email) = LOWER(?)",
            rowMapper,
            email.trim()
        );
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    @Override
    public List<UserAccount> findAll() {
        return jdbc.query("SELECT * FROM app.users ORDER BY created_at ASC", rowMapper);
    }

    @Override
    public boolean existsByRole(UserRole role) {
        if (role == null) return false;
        Integer count = jdbc.queryForObject(
            "SELECT COUNT(*) FROM app.users WHERE role = ?",
            Integer.class,
            role.name()
        );
        return count != null && count > 0;
    }

    @Override
    public boolean existsByEmailIgnoreCase(String email) {
        if (email == null || email.isBlank()) return false;
        Integer count = jdbc.queryForObject(
            "SELECT COUNT(*) FROM app.users WHERE LOWER(email) = LOWER(?)",
            Integer.class,
            email.trim()
        );
        return count != null && count > 0;
    }
}
