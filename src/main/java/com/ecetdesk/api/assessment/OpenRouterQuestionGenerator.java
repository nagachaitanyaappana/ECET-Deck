package com.ecetdesk.api.assessment;

import java.util.*;
import java.time.Duration;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ecetdesk.api.settings.AdminRuntimeSettingsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

@Service
public class OpenRouterQuestionGenerator {
    private final RestClient client;
    private final ObjectMapper mapper;
    private final AdminRuntimeSettingsService runtimeSettings;

    public OpenRouterQuestionGenerator(ObjectMapper mapper, AdminRuntimeSettingsService runtimeSettings) {
        this.mapper = mapper;
        this.runtimeSettings = runtimeSettings;
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(15));
        factory.setReadTimeout(Duration.ofSeconds(90));
        this.client = RestClient.builder()
            .requestFactory(factory)
            .baseUrl("https://openrouter.ai/api/v1")
            .build();
    }

    public List<GeneratedQuestion> generate(String subject, int count, String extraInstructions) {
        if (count <= 0) return Collections.emptyList();
        AdminRuntimeSettingsService.RuntimeConfig config = runtimeSettings.getRuntimeConfig();
        if (config.apiKey() == null || config.apiKey().isBlank()) return Collections.emptyList();
        List<GeneratedQuestion> result = new ArrayList<>();
        int attempts = 0;
        int maxAttempts = Math.max(5, (count / 3) + 2);
        while (result.size() < count && attempts < maxAttempts) {
            attempts++;
            int needed = count - result.size();
            int batch = Math.min(5, needed);
            List<GeneratedQuestion> batchQuestions = generateBatch(subject, batch, extraInstructions, config);
            if (batchQuestions.isEmpty()) {
                break;
            }
            result.addAll(batchQuestions);
        }
        return result;
    }

    private String extractJson(String text) {
        if (text == null) return "{}";
        String trimmed = text.trim();
        if (trimmed.startsWith("```json")) {
            trimmed = trimmed.substring(7);
        } else if (trimmed.startsWith("```")) {
            trimmed = trimmed.substring(3);
        }
        if (trimmed.endsWith("```")) {
            trimmed = trimmed.substring(0, trimmed.length() - 3);
        }
        trimmed = trimmed.trim();
        int start = trimmed.indexOf('{');
        int end = trimmed.lastIndexOf('}');
        if (start >= 0 && end > start) {
            return trimmed.substring(start, end + 1);
        }
        return trimmed;
    }

    private List<GeneratedQuestion> generateBatch(String subject, int count, String extra, AdminRuntimeSettingsService.RuntimeConfig config) {
        String prompt = """
            Create exactly %d original, technically accurate ECET diploma entrance MCQs for subject %s.
            Target Andhra Pradesh ECET DCME diploma-level candidates. Questions must be clear and unambiguous.
            Return ONLY a JSON object with this shape:
            {"questions":[{"questionText":"...","explanation":"...","difficulty":"EASY|MEDIUM|HARD",
            "options":[{"text":"...","correct":false},{"text":"...","correct":true},
            {"text":"...","correct":false},{"text":"...","correct":false}]}]}
            Every question must have exactly four distinct options and exactly one correct option.
            Do not number questions. Do not include markdown. Do not repeat questions.
            Additional focus/instructions: %s
            """.formatted(count, subject, extra == null || extra.isBlank() ? "Follow the standard subject syllabus." : extra);
        Map<String,Object> body = Map.of(
            "model", config.model(),
            "temperature", 0.25,
            "response_format", Map.of("type","json_object"),
            "messages", List.of(
                Map.of("role","system","content","You are a careful ECET question-paper setter. Accuracy is more important than creativity."),
                Map.of("role","user","content",prompt)
            )
        );
        try {
            String raw = client.post().uri("/chat/completions")
                .header("Authorization","Bearer "+config.apiKey())
                .header("HTTP-Referer","https://github.com/nagachaitanyaappana/ECET-Deck")
                .header("X-Title","ECET Desk")
                .body(body).retrieve().body(String.class);
            JsonNode root = mapper.readTree(raw);
            String content = root.path("choices").path(0).path("message").path("content").asText();
            String jsonStr = extractJson(content);
            JsonNode questions = mapper.readTree(jsonStr).path("questions");
            if (!questions.isArray() || questions.isEmpty()) {
                return Collections.emptyList();
            }
            List<GeneratedQuestion> parsed = new ArrayList<>();
            for (JsonNode q : questions) {
                if (parsed.size() >= count) break;
                JsonNode options = q.path("options");
                if (!options.isArray() || options.size() != 4) continue;
                List<GeneratedOption> parsedOptions = new ArrayList<>();
                int correct = 0;
                for (JsonNode option : options) {
                    boolean isCorrect = option.path("correct").asBoolean(false);
                    if (isCorrect) correct++;
                    String text = option.path("text").asText("").trim();
                    if (text.isBlank()) break;
                    parsedOptions.add(new GeneratedOption(text,isCorrect));
                }
                if (correct != 1 || parsedOptions.size() != 4) continue;
                String questionText = q.path("questionText").asText("").trim();
                String difficulty = q.path("difficulty").asText("MEDIUM").toUpperCase(Locale.ROOT);
                if (questionText.isBlank()) continue;
                if (!Set.of("EASY","MEDIUM","HARD").contains(difficulty)) difficulty = "MEDIUM";
                parsed.add(new GeneratedQuestion(questionText, q.path("explanation").asText(""), difficulty, parsedOptions));
            }
            return parsed;
        } catch (Exception ex) {
            System.err.println("OpenRouter batch generation failed: " + ex.getMessage());
            return Collections.emptyList();
        }
    }

    public record GeneratedQuestion(String questionText,String explanation,String difficulty,List<GeneratedOption> options) {}
    public record GeneratedOption(String text,boolean correct) {}
}
