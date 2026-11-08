package com.ecetdesk.api.settings;

import java.util.Map;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/settings")
public class AdminRuntimeSettingsController {
    private final AdminRuntimeSettingsService settings;

    public AdminRuntimeSettingsController(AdminRuntimeSettingsService settings) {
        this.settings = settings;
    }

    @GetMapping
    public Map<String, Object> getSettings() {
        return settings.getSettings();
    }

    @PutMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void update(@Valid @RequestBody UpdateSettingsRequest request, Authentication authentication) {
        settings.update(request.apiKey(), request.clearApiKey(), request.model(), authentication.getName());
    }

    public record UpdateSettingsRequest(
            @Size(max = 500) String apiKey,
            boolean clearApiKey,
            @Size(max = 120) String model) {}
}
