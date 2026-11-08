package com.ecetdesk.api.analytics;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.Map;
import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.ecetdesk.api.auth.CustomUserDetailsService;
import com.ecetdesk.api.auth.JwtAuthenticationFilter;
import com.ecetdesk.api.auth.SecurityConfig;

@WebMvcTest(StudentAnalyticsController.class)
@Import(SecurityConfig.class)
class StudentAnalyticsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StudentAnalyticsService studentAnalyticsService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @BeforeEach
    void setUp() throws Exception {
        doAnswer(invocation -> {
            FilterChain chain = invocation.getArgument(2);
            chain.doFilter(invocation.getArgument(0), invocation.getArgument(1));
            return null;
        }).when(jwtAuthenticationFilter).doFilter(any(), any(), any());
    }

    @Test
    @WithMockUser(username = "student@example.com", roles = "STUDENT")
    void studentCanGetOwnAnalytics() throws Exception {
        Map<String, Object> summary = Map.of(
            "completedAttempts", 4,
            "recentAverage", 78.5,
            "personalBest", 85.0,
            "preparationStatus", "GOOD_PREPARATION",
            "statusBasedOnAttempts", 3
        );
        Map<String, Object> analytics = Map.of(
            "summary", summary,
            "history", List.of(),
            "subjects", List.of(Map.of("subject", "DCME", "accuracy", 80.0, "status", "STRONG")),
            "weakTopics", List.of(),
            "recommendations", List.of("Keep practicing DCME")
        );

        when(studentAnalyticsService.getMyAnalytics(eq("student@example.com"))).thenReturn(analytics);

        mockMvc.perform(get("/api/v1/my/analytics"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.summary.completedAttempts").value(4))
            .andExpect(jsonPath("$.summary.preparationStatus").value("GOOD_PREPARATION"))
            .andExpect(jsonPath("$.subjects[0].subject").value("DCME"));
    }

    @Test
    @WithMockUser(username = "admin@example.com", roles = "ADMIN")
    void nonStudentCannotAccessStudentAnalytics() throws Exception {
        mockMvc.perform(get("/api/v1/my/analytics"))
            .andExpect(status().isForbidden());
    }

    @Test
    void unauthenticatedCannotAccessStudentAnalytics() throws Exception {
        mockMvc.perform(get("/api/v1/my/analytics"))
            .andExpect(status().isUnauthorized());
    }
}
