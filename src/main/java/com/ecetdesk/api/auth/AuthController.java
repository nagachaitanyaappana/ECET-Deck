package com.ecetdesk.api.auth;

import com.ecetdesk.api.user.UserAccount;
import com.ecetdesk.api.user.UserRepository;
import com.ecetdesk.api.user.UserRole;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final EmailAuthService emailAuth;
    private final JdbcTemplate jdbc;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService,
            UserRepository users, PasswordEncoder passwordEncoder, EmailAuthService emailAuth, JdbcTemplate jdbc) {
        this.authenticationManager=authenticationManager; this.jwtService=jwtService;
        this.users=users; this.passwordEncoder=passwordEncoder; this.emailAuth=emailAuth; this.jdbc=jdbc;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String,String> register(@Valid @RequestBody RegistrationRequest request) {
        String email=request.email().trim().toLowerCase();
        if(users.existsByEmailIgnoreCase(email)) throw new ResponseStatusException(HttpStatus.CONFLICT,"An account with this email already exists");
        UserAccount account=users.save(new UserAccount(email,passwordEncoder.encode(request.password()),request.displayName(),UserRole.STUDENT,false));
        emailAuth.issue(account.getId(),account.getEmail(),account.getDisplayName(),"EMAIL_VERIFY");
        return Map.of("message","A verification code has been sent to your email.","email",account.getEmail(),"challenge","EMAIL_VERIFY");
    }

    @PostMapping("/resend-verification")
    public Map<String,String> resendVerification(@Valid @RequestBody EmailRequest request) {
        users.findByEmailIgnoreCase(request.email().trim()).filter(account -> !account.isEmailVerified())
            .ifPresent(account -> emailAuth.issue(account.getId(),account.getEmail(),account.getDisplayName(),"EMAIL_VERIFY"));
        return Map.of("message","If the account needs verification, a new code has been sent.");
    }

    @PostMapping("/verify-email")
    public Map<String,String> verifyEmail(@Valid @RequestBody VerifyCodeRequest request) {
        UserAccount account=users.findByEmailIgnoreCase(request.email().trim()).orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid or expired verification request."));
        if(account.isEmailVerified()) return Map.of("message","Email already verified.");
        emailAuth.verify(account.getId(),"EMAIL_VERIFY",request.code());
        emailAuth.markEmailVerified(account.getId());
        return Map.of("message","Email verified. You can now sign in.");
    }

    @PostMapping("/login")
    public Map<String,String> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication;
        try {
            authentication=authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email().trim().toLowerCase(),request.password()));
        } catch(AuthenticationException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid email or password");
        }
        UserAccount account=users.findByEmailIgnoreCase(authentication.getName()).orElseThrow();
        emailAuth.issue(account.getId(),account.getEmail(),account.getDisplayName(),"LOGIN_OTP");
        return Map.of("message","A sign-in code has been sent to your email.","email",account.getEmail(),"challenge","LOGIN_OTP");
    }

    @PostMapping("/verify-login")
    public LoginResponse verifyLogin(@Valid @RequestBody VerifyCodeRequest request) {
        UserAccount account=users.findByEmailIgnoreCase(request.email().trim()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid or expired sign-in challenge."));
        if(!account.isEnabled() || !account.isEmailVerified()) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Account is not active.");
        emailAuth.verify(account.getId(),"LOGIN_OTP",request.code());
        Authentication authentication=new UsernamePasswordAuthenticationToken(account.getEmail(),null,
                java.util.List.of(new SimpleGrantedAuthority("ROLE_"+account.getRole().name())));
        emailAuth.notifyLogin(account);
        return new LoginResponse(jwtService.createToken(authentication),"Bearer",account.getId(),account.getEmail(),account.getDisplayName(),account.getRole().name());
    }

    @PostMapping("/forgot-password")
    public Map<String,String> forgotPassword(@Valid @RequestBody EmailRequest request) {
        users.findByEmailIgnoreCase(request.email().trim()).filter(UserAccount::isEmailVerified).ifPresent(account -> {
            try { emailAuth.issue(account.getId(),account.getEmail(),account.getDisplayName(),"PASSWORD_RESET"); }
            catch(AuthFlowException ex) { /* Keep the response indistinguishable for known and unknown addresses. */ }
        });
        return Map.of("message","If an eligible account exists, password recovery instructions have been sent.");
    }

    @PostMapping("/reset-password")
    public Map<String,String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        UserAccount account=users.findByEmailIgnoreCase(request.email().trim()).orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid or expired recovery request."));
        emailAuth.verify(account.getId(),"PASSWORD_RESET",request.code());
        emailAuth.changePassword(account.getId(),passwordEncoder.encode(request.newPassword()));
        return Map.of("message","Password updated. Please sign in again.");
    }

    public record RegistrationRequest(@NotBlank @Email @Size(max=320) String email,@NotBlank @Size(min=10,max=100) String password,@NotBlank @Size(max=100) String displayName) {}
    public record LoginRequest(@NotBlank @Email String email,@NotBlank @Size(max=100) String password) {}
    public record EmailRequest(@NotBlank @Email @Size(max=320) String email) {}
    public record VerifyCodeRequest(@NotBlank @Email String email,@NotBlank @Size(min=6,max=6) String code) {}
    public record ResetPasswordRequest(@NotBlank @Email String email,@NotBlank @Size(min=6,max=6) String code,@NotBlank @Size(min=10,max=100) String newPassword) {}
    public record LoginResponse(String accessToken,String tokenType,UUID userId,String email,String displayName,String role) {}
}
