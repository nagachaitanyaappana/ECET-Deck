package com.ecetdesk.api.health;

import java.time.Instant;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    private final JdbcTemplate jdbcTemplate;

    public HealthController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping({"/", "/api/v1/health"})
    public HealthResponse health() {
        return new HealthResponse("UP", "ECET Desk API is running", Instant.now());
    }

    @GetMapping({"/db", "/db/"})
    public ResponseEntity<Map<String, Object>> dbHealth() {
        try {
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            if (result != null && result == 1) {
                return ResponseEntity.ok(Map.of(
                    "status", "UP",
                    "database", "PostgreSQL",
                    "message", "Database connection is healthy",
                    "timestamp", Instant.now().toString()
                ));
            } else {
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(
                    "status", "DOWN",
                    "database", "PostgreSQL",
                    "message", "Database check returned unexpected result",
                    "timestamp", Instant.now().toString()
                ));
            }
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(
                "status", "DOWN",
                "database", "PostgreSQL",
                "message", "Database connection failed: " + ex.getMessage(),
                "timestamp", Instant.now().toString()
            ));
        }
    }

    public record HealthResponse(String status, String message, Instant timestamp) {
    }
}
