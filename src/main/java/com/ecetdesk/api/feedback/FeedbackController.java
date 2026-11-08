package com.ecetdesk.api.feedback;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class FeedbackController {
    private final FeedbackService service;

    public FeedbackController(FeedbackService service) {
        this.service = service;
    }

    @PostMapping("/feedbacks")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> submitFeedback(@Valid @RequestBody CreateFeedbackRequest request,
                                              Authentication authentication) {
        return service.submitFeedback(authentication.getName(), request);
    }

    @GetMapping("/feedbacks")
    public List<Map<String, Object>> getMyFeedbacks(Authentication authentication) {
        return service.getMyFeedbacks(authentication.getName());
    }

    @GetMapping("/admin/feedbacks")
    public List<Map<String, Object>> listAllForAdmin() {
        return service.listAllForAdmin();
    }

    @PatchMapping("/admin/feedbacks/{feedbackId}/status")
    public Map<String, Object> updateStatus(@PathVariable UUID feedbackId,
                                            @Valid @RequestBody UpdateStatusRequest request) {
        return service.updateStatus(feedbackId, request);
    }

    public record CreateFeedbackRequest(
        String category,
        @NotBlank @Size(max = 160) String subject,
        @NotBlank @Size(max = 4000) String message
    ) {}

    public record UpdateStatusRequest(
        @NotBlank String status,
        String adminNotes
    ) {}
}
