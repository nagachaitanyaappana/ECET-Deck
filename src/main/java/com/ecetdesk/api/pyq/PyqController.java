package com.ecetdesk.api.pyq;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class PyqController {
    private final PyqService service;
    private final SupabasePaperStorageService storage;
    public PyqController(PyqService service, SupabasePaperStorageService storage) { this.service=service; this.storage=storage; }

    // ADMIN: curate and verify source questions before they enter the student exam pool.
    @PostMapping("/admin/pyq/questions")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String,Object> createQuestion(@Valid @RequestBody QuestionPayload request) {
        return service.createQuestion(toQuestionRequest(request));
    }

    @PostMapping("/admin/pyq/questions/bulk")
    @ResponseStatus(HttpStatus.CREATED)
    public List<Map<String,Object>> bulkImport(@RequestBody @NotEmpty @Size(max=250) List<@Valid QuestionPayload> requests) {
        return service.createQuestions(requests.stream().map(this::toQuestionRequest).toList());
    }

    private PyqService.QuestionRequest toQuestionRequest(QuestionPayload request) {
        return new PyqService.QuestionRequest(request.subject(),request.topic(),request.curriculum(),
            request.questionText(),request.explanation(),request.sourceYear(),request.sourcePaper(),
            request.sourceQuestionNumber(),request.difficulty(),request.verified(),
            request.options().stream().map(o -> new PyqService.OptionRequest(o.text(),o.correct())).toList());
    }

    @GetMapping("/admin/pyq/questions")
    public List<Map<String,Object>> listQuestions(@RequestParam(required=false) String subject,
        @RequestParam(required=false) Integer year,
        @RequestParam(defaultValue="true") boolean includeUnverified) {
        return service.listQuestions(subject,year,includeUnverified);
    }

    @PostMapping("/admin/pyq/papers")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String,Object> createPaper(@Valid @RequestBody PaperPayload request) {
        return service.createPaper(new PyqService.PaperRequest(request.title(),request.examYear(),
            request.branch(),request.curriculum(),request.paperType(),request.storagePath(),
            request.publicUrl(),request.sourceName(),request.attribution()));
    }

    @GetMapping("/admin/pyq/papers")
    public List<Map<String,Object>> adminPapers() { return service.listAdminPapers(); }

    @PatchMapping("/admin/pyq/papers/{paperId}/active")
    public Map<String,Object> setPaperActive(@PathVariable UUID paperId, @Valid @RequestBody PaperActivePayload request) {
        return service.setPaperActive(paperId,request.active());
    }

    @PostMapping(value="/admin/pyq/papers/upload", consumes="multipart/form-data")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String,Object> uploadPaper(
        @RequestParam("file") MultipartFile file,
        @RequestParam("title") String title,
        @RequestParam("examYear") Integer examYear,
        @RequestParam("paperType") String paperType,
        @RequestParam(value="sourceName", required=false) String sourceName,
        @RequestParam(value="attribution", required=false) String attribution) {
        if (title == null || title.isBlank() || title.length() > 180)
            throw new org.springframework.web.server.ResponseStatusException(HttpStatus.BAD_REQUEST,"Enter a paper title (up to 180 characters).");
        if (examYear == null || examYear < 2000 || examYear > 2100)
            throw new org.springframework.web.server.ResponseStatusException(HttpStatus.BAD_REQUEST,"Enter a valid exam year.");
        if (!"QUESTION_PAPER".equals(paperType) && !"ANSWER_KEY".equals(paperType))
            throw new org.springframework.web.server.ResponseStatusException(HttpStatus.BAD_REQUEST,"Paper type must be QUESTION_PAPER or ANSWER_KEY.");
        SupabasePaperStorageService.UploadedPaper uploaded = storage.upload(file,examYear,paperType);
        return service.createPaper(new PyqService.PaperRequest(title,examYear,"DCME","C23",paperType,
            uploaded.storagePath(),uploaded.publicUrl(),sourceName,attribution));
    }

    @GetMapping("/admin/pyq/attempts")
    public List<Map<String,Object>> adminAttempts() { return service.adminAttempts(); }

    @GetMapping("/admin/pyq/attempts/{attemptId}/review")
    public Map<String,Object> adminReview(@PathVariable UUID attemptId) { return service.adminReview(attemptId); }

    // STUDENT: this namespace is explicitly restricted to STUDENT role in SecurityConfig.
    @GetMapping("/pyq/papers")
    public List<Map<String,Object>> papers(@RequestParam(defaultValue="DCME") String branch,
        @RequestParam(defaultValue="C23") String curriculum) {
        return service.listPapers(branch,curriculum);
    }

    @GetMapping("/pyq/attempts/current")
    public Map<String,Object> currentAttempt(Authentication authentication) {
        return service.currentAttempt(authentication.getName());
    }

    @PostMapping("/pyq/attempts")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String,Object> startAttempt(Authentication authentication) {
        return service.startAttempt(authentication.getName());
    }

    @GetMapping("/pyq/attempts/{attemptId}")
    public Map<String,Object> getAttempt(@PathVariable UUID attemptId,Authentication authentication) {
        return service.getAttempt(attemptId,authentication.getName());
    }

    @PutMapping("/pyq/attempts/{attemptId}/answers/{questionId}")
    public Map<String,Object> saveAnswer(@PathVariable UUID attemptId,@PathVariable UUID questionId,
        @Valid @RequestBody AnswerPayload request,Authentication authentication) {
        return service.saveAnswer(attemptId,questionId,request.optionId(),authentication.getName());
    }

    @PostMapping("/pyq/attempts/{attemptId}/submit")
    public Map<String,Object> submit(@PathVariable UUID attemptId,Authentication authentication) {
        return service.submit(attemptId,authentication.getName());
    }

    @GetMapping("/pyq/my/results")
    public List<Map<String,Object>> myResults(Authentication authentication) {
        return service.studentResults(authentication.getName());
    }

    public record OptionPayload(@NotBlank @Size(max=2000) String text,@NotNull Boolean correct) {}
    public record QuestionPayload(
        @NotBlank @Pattern(regexp="DCME|MATHEMATICS|PHYSICS|CHEMISTRY") String subject,
        @Size(max=160) String topic,
        @NotBlank @Pattern(regexp="C23") String curriculum,
        @NotBlank String questionText,String explanation,
        @NotNull @Min(2000) @Max(2100) Integer sourceYear,
        @NotBlank @Size(max=160) String sourcePaper,
        @Min(1) Integer sourceQuestionNumber,
        @Pattern(regexp="EASY|MEDIUM|HARD") String difficulty,
        @NotNull Boolean verified,
        @NotNull @Size(min=4,max=4) List<@Valid OptionPayload> options) {}
    public record PaperPayload(@NotBlank @Size(max=180) String title,
        @NotNull @Min(2000) @Max(2100) Integer examYear,
        @NotBlank @Pattern(regexp="DCME") String branch,
        @NotBlank @Pattern(regexp="C23") String curriculum,
        @NotBlank @Pattern(regexp="QUESTION_PAPER|ANSWER_KEY") String paperType,
        @NotBlank String storagePath,String publicUrl,String sourceName,String attribution) {}
    public record AnswerPayload(@NotNull UUID optionId) {}
    public record PaperActivePayload(@NotNull Boolean active) {}
}
