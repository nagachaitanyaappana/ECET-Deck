package com.ecetdesk.api.settings;

import jakarta.validation.constraints.Size;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/settings")
public class AdminRuntimeSettingsController {
    private final AdminRuntimeSettingsService settings;
    public AdminRuntimeSettingsController(AdminRuntimeSettingsService settings) { this.settings = settings; }

    @GetMapping
    public AdminRuntimeSettingsService.SettingsView get() { return settings.getSettings(); }

    @PutMapping
    public AdminRuntimeSettingsService.SettingsView update(@RequestBody UpdateRequest request) {
        return settings.update(request.apiKey(), request.clearApiKey(), request.model());
    }

    public record UpdateRequest(@Size(max=500) String apiKey, boolean clearApiKey, @Size(max=160) String model) {}
}
