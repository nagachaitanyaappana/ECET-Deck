package com.ecetdesk.api.pyq;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.ecetdesk.api.auth.CustomUserDetailsService;
import com.ecetdesk.api.auth.JwtAuthenticationFilter;
import com.ecetdesk.api.auth.SecurityConfig;

@WebMvcTest(PyqController.class)
@Import(SecurityConfig.class)
class PyqControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PyqService pyqService;

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
    void studentCanListPapers() throws Exception {
        Map<String, Object> paper = Map.of(
            "id", UUID.randomUUID(),
            "title", "AP ECET 2025 CSE Question Paper",
            "examYear", 2025,
            "branch", "DCME",
            "curriculum", "C23",
            "paperType", "QUESTION_PAPER",
            "publicUrl", "https://drive.google.com/file/d/1yqxeVh9gzp3aH62843AYWjrN7jGX_zO1/view"
        );

        when(pyqService.listPapers(eq("DCME"), eq("C23"))).thenReturn(List.of(paper));

        mockMvc.perform(get("/api/v1/pyq/papers"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].title").value("AP ECET 2025 CSE Question Paper"))
            .andExpect(jsonPath("$[0].examYear").value(2025));
    }

    @Test
    @WithMockUser(username = "admin@example.com", roles = "ADMIN")
    void adminCanAlsoListPapers() throws Exception {
        Map<String, Object> paper = Map.of(
            "id", UUID.randomUUID(),
            "title", "AP ECET 2026 CSE Question Paper",
            "examYear", 2026,
            "branch", "DCME",
            "curriculum", "C23",
            "paperType", "QUESTION_PAPER"
        );

        when(pyqService.listPapers(eq("DCME"), eq("C23"))).thenReturn(List.of(paper));

        mockMvc.perform(get("/api/v1/pyq/papers"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].examYear").value(2026));
    }

    @Test
    @WithMockUser(username = "student@example.com", roles = "STUDENT")
    void studentCanStartAttempt() throws Exception {
        UUID attemptId = UUID.randomUUID();
        Map<String, Object> attempt = Map.of(
            "attemptId", attemptId,
            "status", "IN_PROGRESS",
            "durationMinutes", 180,
            "questions", List.of()
        );

        when(pyqService.startAttempt(eq("student@example.com"))).thenReturn(attempt);

        mockMvc.perform(post("/api/v1/pyq/attempts"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.attemptId").value(attemptId.toString()))
            .andExpect(jsonPath("$.status").value("IN_PROGRESS"));
    }

    @Test
    @WithMockUser(username = "student@example.com", roles = "STUDENT")
    void studentCanSaveAnswer() throws Exception {
        UUID attemptId = UUID.randomUUID();
        UUID questionId = UUID.randomUUID();
        UUID optionId = UUID.randomUUID();

        when(pyqService.saveAnswer(eq(attemptId), eq(questionId), eq(optionId), eq("student@example.com")))
            .thenReturn(Map.of("saved", true, "questionId", questionId));

        mockMvc.perform(put("/api/v1/pyq/attempts/" + attemptId + "/answers/" + questionId)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"optionId\": \"" + optionId + "\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.saved").value(true));
    }

    @Test
    @WithMockUser(username = "student@example.com", roles = "STUDENT")
    void studentCannotAccessAdminPyqEndpoints() throws Exception {
        mockMvc.perform(get("/api/v1/admin/pyq/questions"))
            .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin@example.com", roles = "ADMIN")
    void adminCanRegisterDrivePaperLink() throws Exception {
        Map<String, Object> response = Map.of(
            "id", UUID.randomUUID(),
            "title", "AP ECET 2025 CSE Key",
            "examYear", 2025,
            "paperType", "ANSWER_KEY"
        );

        when(pyqService.createPaper(any())).thenReturn(response);

        mockMvc.perform(post("/api/v1/admin/pyq/papers/link")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "title": "AP ECET 2025 CSE Key",
                      "examYear": 2025,
                      "paperType": "ANSWER_KEY",
                      "googleDriveUrl": "https://drive.google.com/file/d/1yqxeVh9gzp3aH62843AYWjrN7jGX_zO1/view?usp=sharing"
                    }
                    """))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.title").value("AP ECET 2025 CSE Key"));
    }
}
