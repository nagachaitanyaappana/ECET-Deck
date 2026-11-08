package com.ecetdesk.api.user;

import java.util.List;
import java.util.UUID;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/admin/students")
public class AdminUserController {
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;

    public AdminUserController(UserRepository users, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StudentResponse createStudent(@Valid @RequestBody CreateStudentRequest request) {
        String email = request.email().trim().toLowerCase();
        if (users.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists");
        }
        var saved = users.save(new UserAccount(email, passwordEncoder.encode(request.password()),
                request.displayName(), UserRole.STUDENT));
        return toResponse(saved);
    }

    @GetMapping
    public List<StudentResponse> listStudents() {
        return users.findAll().stream().filter(user -> user.getRole() == UserRole.STUDENT)
                .map(this::toResponse).toList();
    }

    private StudentResponse toResponse(UserAccount user) {
        return new StudentResponse(user.getId(), user.getEmail(), user.getDisplayName(), user.getRole().name());
    }

    public record CreateStudentRequest(@NotBlank @Email String email,
                                       @NotBlank @Size(min = 10, max = 100) String password,
                                       @NotBlank @Size(max = 100) String displayName) {}
    public record StudentResponse(UUID id, String email, String displayName, String role) {}
}
