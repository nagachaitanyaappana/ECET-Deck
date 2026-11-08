package com.ecetdesk.api.request;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class GrandTestRequestController {
    private final GrandTestRequestService service;

    public GrandTestRequestController(GrandTestRequestService service) {
        this.service = service;
    }

    @PostMapping("/requests/grand-test")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> createRequest(@RequestBody(required = false) CreateRequestPayload payload,
                                             Authentication authentication) {
        return service.createRequest(authentication.getName(), payload);
    }

    @GetMapping("/requests/grand-test")
    public List<Map<String, Object>> getMyRequests(Authentication authentication) {
        return service.getMyRequests(authentication.getName());
    }

    @GetMapping("/admin/requests/grand-test")
    public List<Map<String, Object>> listAllForAdmin() {
        return service.listAllForAdmin();
    }

    @PostMapping("/admin/requests/grand-test/{requestId}/fulfill")
    public Map<String, Object> fulfillRequest(@PathVariable UUID requestId,
                                              @RequestBody(required = false) FulfillPayload payload,
                                              Authentication authentication) {
        return service.fulfillRequest(requestId, payload, authentication.getName());
    }

    @PostMapping("/admin/requests/grand-test/{requestId}/dismiss")
    public Map<String, Object> dismissRequest(@PathVariable UUID requestId,
                                              Authentication authentication) {
        return service.dismissRequest(requestId, authentication.getName());
    }

    public record CreateRequestPayload(@Size(max = 1000) String note) {}
    public record FulfillPayload(boolean autoGenerate, UUID testId, String instructions, String customTitle) {}
}
