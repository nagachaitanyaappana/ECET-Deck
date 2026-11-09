package com.ecetdesk.api.practice;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/practice")
public class PracticeController {

    private final PracticeService service;

    public PracticeController(PracticeService service) {
        this.service = service;
    }

    @GetMapping("/topics")
    public List<PracticeService.SubjectCatalog> getTopicsCatalog() {
        return service.getTopicsCatalog();
    }

    @PostMapping("/start")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> startPractice(
            @RequestBody PracticeService.StartPracticeRequest request,
            Authentication authentication) {
        return service.startPractice(request, authentication.getName());
    }

    @PostMapping("/attempts/{attemptId}/questions/{questionId}/answers")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void saveAnswer(
            @PathVariable UUID attemptId,
            @PathVariable UUID questionId,
            @RequestBody PracticeService.SaveAnswerRequest request,
            Authentication authentication) {
        service.saveAnswer(attemptId, questionId, request, authentication.getName());
    }

    @PostMapping("/attempts/{attemptId}/submit")
    public Map<String, Object> submitPractice(
            @PathVariable UUID attemptId,
            Authentication authentication) {
        return service.submitPractice(attemptId, authentication.getName());
    }

    @GetMapping("/attempts/{attemptId}/review")
    public Map<String, Object> getPracticeReview(
            @PathVariable UUID attemptId,
            Authentication authentication) {
        return service.getPracticeReview(attemptId, authentication.getName());
    }

    @GetMapping("/attempts/recent")
    public List<Map<String, Object>> getRecentAttempts(Authentication authentication) {
        return service.getRecentAttempts(authentication.getName());
    }
}
