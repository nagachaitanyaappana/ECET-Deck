package com.ecetdesk.api.assessment;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1")
public class AssessmentController {
    private final AssessmentService service;

    public AssessmentController(AssessmentService service) {
        this.service = service;
    }

    @PostMapping("/admin/tests")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> createTest(@Valid @RequestBody CreateTestRequest request,
                                          Authentication authentication) {
        return service.createTest(request, authentication.getName());
    }

    @PostMapping("/admin/tests/auto-generate")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> autoGenerateTest(@Valid @RequestBody AutoGenerateTestRequest request,
                                                Authentication authentication) {
        return service.autoGenerateTest(request, authentication.getName());
    }

    @DeleteMapping("/admin/tests/{testId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTest(@PathVariable UUID testId) {
        service.deleteTest(testId);
    }

    @GetMapping("/admin/tests")
    public List<Map<String, Object>> listAllTestsForAdmin() {
        return service.listAllTestsForAdmin();
    }

    @PostMapping("/admin/questions")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> createQuestion(@Valid @RequestBody CreateQuestionRequest request) {
        return service.createQuestion(request);
    }

    @GetMapping("/admin/tests/{testId}")
    public Map<String, Object> getAdminTest(@PathVariable UUID testId) {
        return service.getAdminTest(testId);
    }

    @PostMapping("/admin/tests/{testId}/questions/{questionId}")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> addQuestion(@PathVariable UUID testId, @PathVariable UUID questionId) {
        return service.addQuestion(testId, questionId);
    }

    @PostMapping("/admin/tests/{testId}/generate")
    public Map<String, Object> generateQuestions(@PathVariable UUID testId,
                                                  @RequestBody(required = false) GenerateRequest request) {
        return service.generateQuestions(testId, request == null ? null : request.instructions());
    }

    @PostMapping("/admin/tests/{testId}/publish")
    public Map<String, Object> publish(@PathVariable UUID testId) {
        return service.publish(testId);
    }

    @GetMapping("/tests")
    public List<Map<String, Object>> availableTests() {
        return service.availableTests();
    }

    @PostMapping("/tests/{testId}/attempts")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> startAttempt(@PathVariable UUID testId, Authentication authentication) {
        return service.startAttempt(testId, authentication.getName());
    }

    @GetMapping("/attempts/{attemptId}")
    public Map<String, Object> getAttempt(@PathVariable UUID attemptId, Authentication authentication) {
        return service.getAttempt(attemptId, authentication.getName());
    }

    @GetMapping("/attempts/{attemptId}/review")
    public Map<String, Object> getAttemptReview(@PathVariable UUID attemptId,
                                                @RequestParam(required = false, defaultValue = "false") boolean wrongOnly,
                                                Authentication authentication) {
        return service.getAttemptReview(attemptId, authentication.getName(), wrongOnly);
    }

    @GetMapping("/admin/tests/{testId}/attempts")
    public List<Map<String, Object>> getTestAttemptsForAdmin(@PathVariable UUID testId) {
        return service.getTestAttemptsForAdmin(testId);
    }

    @GetMapping("/admin/students/{studentId}/attempts")
    public List<Map<String, Object>> getStudentAttemptsForAdmin(@PathVariable UUID studentId) {
        return service.getStudentAttemptsForAdmin(studentId);
    }

    @GetMapping("/admin/analytics/leaderboard")
    public List<Map<String, Object>> getLeaderboard() {
        return service.getLeaderboard();
    }

    @PutMapping("/attempts/{attemptId}/answers/{questionId}")
    public Map<String, Object> saveAnswer(@PathVariable UUID attemptId, @PathVariable UUID questionId,
                                          @Valid @RequestBody AnswerRequest request,
                                          Authentication authentication) {
        return service.saveAnswer(attemptId, questionId, request.optionId(), authentication.getName());
    }

    @PostMapping("/attempts/{attemptId}/submit")
    public Map<String, Object> submit(@PathVariable UUID attemptId, Authentication authentication) {
        return service.submit(attemptId, authentication.getName());
    }

    @GetMapping("/my/results")
    public List<Map<String, Object>> myResults(Authentication authentication) {
        return service.myResults(authentication.getName());
    }

    public record CreateTestRequest(@NotBlank @Size(max=160) String title,
                                    @NotBlank @Pattern(regexp="GRAND|DAILY") String testType,
                                    String scheduledDate) {}
    public record OptionRequest(@NotBlank @Size(max=2000) String text, @NotNull Boolean correct) {}
    public record CreateQuestionRequest(@NotBlank @Pattern(regexp="DCME|MATHEMATICS|PHYSICS|CHEMISTRY") String subject,
                                        @NotBlank String questionText, String explanation,
                                        @NotBlank @Pattern(regexp="EASY|MEDIUM|HARD") String difficulty,
                                        @NotNull @Size(min=4,max=4) List<@Valid OptionRequest> options) {}
    public record AnswerRequest(@NotNull UUID optionId) {}
    public record GenerateRequest(@Size(max=1000) String instructions) {}
    public record AutoGenerateTestRequest(@NotBlank @Pattern(regexp="GRAND|DAILY") String testType,
                                          @Size(max=1000) String instructions,
                                          String scheduledDate,
                                          @Size(max=160) String customTitle) {}
}
