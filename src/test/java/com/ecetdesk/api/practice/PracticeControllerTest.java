package com.ecetdesk.api.practice;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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

@WebMvcTest(PracticeController.class)
@Import(SecurityConfig.class)
class PracticeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PracticeService practiceService;

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
    void studentCanFetchTopicsCatalog() throws Exception {
        PracticeService.ConceptInfo c1 = new PracticeService.ConceptInfo("Process Management & CPU Scheduling", 15);
        PracticeService.SubjectCatalog catalog = new PracticeService.SubjectCatalog(
            "OPERATING_SYSTEMS",
            "Operating Systems",
            "DCME",
            "CM-303",
            25,
            List.of(c1),
            List.of(c1)
        );

        when(practiceService.getTopicsCatalog()).thenReturn(List.of(catalog));

        mockMvc.perform(get("/api/v1/practice/topics"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].subject").value("OPERATING_SYSTEMS"))
            .andExpect(jsonPath("$[0].displayName").value("Operating Systems"))
            .andExpect(jsonPath("$[0].code").value("CM-303"))
            .andExpect(jsonPath("$[0].stream").value("DCME"))
            .andExpect(jsonPath("$[0].concepts[0].name").value("Process Management & CPU Scheduling"));
    }

    @Test
    @WithMockUser(username = "student@example.com", roles = "STUDENT")
    void studentCanStartPracticeDrill() throws Exception {
        UUID attemptId = UUID.randomUUID();
        Map<String, Object> attemptResponse = Map.of(
            "attemptId", attemptId,
            "subject", "Operating Systems",
            "mode", "SUBJECT",
            "selectedConcepts", "Process Management & CPU Scheduling",
            "totalQuestions", 50,
            "durationMinutes", 0,
            "status", "IN_PROGRESS",
            "questions", List.of()
        );

        when(practiceService.startPractice(any(), eq("student@example.com"))).thenReturn(attemptResponse);

        mockMvc.perform(post("/api/v1/practice/start")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "subject": "OPERATING_SYSTEMS",
                        "concepts": [],
                        "questionCount": 50,
                        "timed": false
                    }
                """))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.attemptId").value(attemptId.toString()))
            .andExpect(jsonPath("$.subject").value("Operating Systems"))
            .andExpect(jsonPath("$.totalQuestions").value(50));
    }
}
