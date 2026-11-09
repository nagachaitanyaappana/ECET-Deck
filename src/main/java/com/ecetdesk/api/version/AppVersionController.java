package com.ecetdesk.api.version;

import com.ecetdesk.api.settings.AdminRuntimeSettingsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/app")
public class AppVersionController {

    private final AdminRuntimeSettingsService settingsService;

    public AppVersionController(AdminRuntimeSettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping("/version")
    public Map<String, Object> getAppVersion() {
        return settingsService.getAppVersionInfo();
    }
}
