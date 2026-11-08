package com.ecetdesk.api.analytics;

import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/my")
public class StudentAnalyticsController {
    private final StudentAnalyticsService service;
    public StudentAnalyticsController(StudentAnalyticsService service) { this.service = service; }

    @GetMapping("/analytics")
    public Map<String,Object> myAnalytics(Authentication authentication) {
        return service.getMyAnalytics(authentication.getName());
    }
}
