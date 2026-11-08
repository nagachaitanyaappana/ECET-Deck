package com.ecetdesk.api.auth;

import com.ecetdesk.api.user.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository users;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService,
                          UserRepository users) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.users = users;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email().trim().toLowerCase(),
                            request.password()));
            var account = users.findByEmailIgnoreCase(authentication.getName())
                    .orElseThrow();
            return new LoginResponse(jwtService.createToken(authentication), "Bearer",
                    account.getId(), account.getEmail(), account.getDisplayName(), account.getRole().name());
        } catch (AuthenticationException exception) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }
    }

    public record LoginRequest(@NotBlank @Email String email,
                               @NotBlank @Size(max = 100) String password) {}
    public record LoginResponse(String accessToken, String tokenType,
                                java.util.UUID userId, String email, String displayName, String role) {}
}
