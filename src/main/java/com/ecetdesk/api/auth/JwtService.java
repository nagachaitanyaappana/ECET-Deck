package com.ecetdesk.api.auth;

import java.util.Base64;
import java.util.Date;
import javax.crypto.SecretKey;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
    private final SecretKey key;
    private final long expirationMillis;

    public JwtService(
            @Value("${app.security.jwt.secret-base64}") String secretBase64,
            @Value("${app.security.jwt.access-token-minutes:43200}") long accessTokenMinutes) {
        if (secretBase64 == null || secretBase64.isBlank()) {
            throw new IllegalStateException("JWT_SECRET_BASE64 must be configured before starting the API.");
        }
        byte[] secret = Base64.getDecoder().decode(secretBase64);
        if (secret.length < 32) {
            throw new IllegalStateException("JWT_SECRET_BASE64 must decode to at least 32 bytes.");
        }
        this.key = Keys.hmacShaKeyFor(secret);
        this.expirationMillis = accessTokenMinutes * 60_000L;
    }

    public String createToken(Authentication authentication) {
        Date now = new Date();
        return Jwts.builder()
                .subject(authentication.getName())
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expirationMillis))
                .signWith(key)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser().verifyWith(key).build()
                .parseSignedClaims(token).getPayload().getSubject();
    }

    public boolean isValid(String token) {
        try {
            extractUsername(token);
            return true;
        } catch (RuntimeException exception) {
            return false;
        }
    }
}
