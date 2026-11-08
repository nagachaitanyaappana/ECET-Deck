package com.ecetdesk.api.assessment;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;

import com.ecetdesk.api.auth.CustomUserDetailsService;
import com.ecetdesk.api.auth.JwtAuthenticationFilter;
import com.ecetdesk.api.auth.SecurityConfig;

@WebMvcTest(AssessmentController.class)
@Import(SecurityConfig.class)
class AssessmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AssessmentService assessmentService;

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
    void studentCanGetAttemptReviewWithWrongAnswersAndExplanations() throws Exception {
        UUID attemptId = UUID.randomUUID();
        UUID questionId = UUID.randomUUID();

        Map<String, Object> question = new LinkedHashMap<>();
        question.put("questionId", questionId);
        question.put("questionOrder", 1);
        question.put("subject", "DCME");
        question.put("questionText", "What is the time complexity of binary search?");
        question.put("explanation", "Binary search halves the search space at each step, yielding O(log n).");
        question.put("resultStatus", "INCORRECT");
        question.put("isWrong", true);
        question.put("selectedOptionLabel", "A");
        question.put("selectedOptionText", "O(n)");
        question.put("correctOptionLabel", "B");
        question.put("correctOptionText", "O(log n)");

        Map<String, Object> reviewResponse = new LinkedHashMap<>();
        reviewResponse.put("attemptId", attemptId);
        reviewResponse.put("testTitle", "Daily Mock 1");
        reviewResponse.put("status", "SUBMITTED");
        reviewResponse.put("score", 0);
        reviewResponse.put("correctCount", 0);
        reviewResponse.put("incorrectCount", 1);
        reviewResponse.put("unansweredCount", 0);
        reviewResponse.put("questions", List.of(question));

        when(assessmentService.getAttemptReview(eq(attemptId), eq("student@example.com"), eq(false)))
            .thenReturn(reviewResponse);

        mockMvc.perform(get("/api/v1/attempts/" + attemptId + "/review"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("SUBMITTED"))
            .andExpect(jsonPath("$.questions[0].isWrong").value(true))
            .andExpect(jsonPath("$.questions[0].explanation")
                .value("Binary search halves the search space at each step, yielding O(log n)."))
            .andExpect(jsonPath("$.questions[0].selectedOptionText").value("O(n)"))
            .andExpect(jsonPath("$.questions[0].correctOptionText").value("O(log n)"));
    }

    @Test
    @WithMockUser(username = "admin@example.com", roles = "ADMIN")
    void adminCanAccessGroupLeaderboard() throws Exception {
        Map<String, Object> entry = Map.of(
            "studentId", UUID.randomUUID(),
            "displayName", "Chaitanya",
            "email", "chaitanya@example.com",
            "testsCompleted", 5,
            "totalScore", 420,
            "averageScore", 84.0
        );

        when(assessmentService.getLeaderboard()).thenReturn(List.of(entry));

        mockMvc.perform(get("/api/v1/admin/analytics/leaderboard"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].displayName").value("Chaitanya"))
            .andExpect(jsonPath("$[0].testsCompleted").value(5))
            .andExpect(jsonPath("$[0].averageScore").value(84.0));
    }

    @Test
    @WithMockUser(username = "student@example.com", roles = "STUDENT")
    void studentCannotAccessAdminLeaderboard() throws Exception {
        mockMvc.perform(get("/api/v1/admin/analytics/leaderboard"))
            .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin@example.com", roles = "ADMIN")
    void adminCanAutoGenerateTest() throws Exception {
        UUID testId = UUID.randomUUID();
        Map<String, Object> response = Map.of(
            "id", testId,
            "title", "Daily Mock - 2026-11-08",
            "testType", "DAILY",
            "status", "PUBLISHED",
            "questionCount", 50,
            "durationMinutes", 0,
            "totalMarks", 50
        );

        when(assessmentService.autoGenerateTest(any(), eq("admin@example.com")))
            .thenReturn(response);

        mockMvc.perform(post("/api/v1/admin/tests/auto-generate")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"testType": "DAILY", "instructions": "Focus on data structures"}
                    """))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.title").value("Daily Mock - 2026-11-08"))
            .andExpect(jsonPath("$.status").value("PUBLISHED"))
            .andExpect(jsonPath("$.questionCount").value(50));
    }

    @Test
    @WithMockUser(username = "student@example.com", roles = "STUDENT")
    void studentCannotAutoGenerateTest() throws Exception {
        mockMvc.perform(post("/api/v1/admin/tests/auto-generate")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"testType": "DAILY"}
                    """))
            .andExpect(status().isForbidden());
    }
}
