package com.ecetdesk.api.assessment;

import java.util.*;
import java.time.Duration;
import com.ecetdesk.api.settings.AdminRuntimeSettingsService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.server.ResponseStatusException;

@Service
public class OpenRouterQuestionGenerator {
    private static final Logger log = LoggerFactory.getLogger(OpenRouterQuestionGenerator.class);
    private final RestClient client;
    private final ObjectMapper mapper;
    private final AdminRuntimeSettingsService settings;

    public OpenRouterQuestionGenerator(ObjectMapper mapper, AdminRuntimeSettingsService settings) {
        this.mapper = mapper;
        this.settings = settings;
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(10));
        factory.setReadTimeout(Duration.ofSeconds(25));
        this.client = RestClient.builder().requestFactory(factory)
                .baseUrl("https://openrouter.ai/api/v1").build();
    }

    public List<GeneratedQuestion> generate(String subject, int count, String extraInstructions) {
        var config = settings.getRuntimeConfig();
        if (config.apiKey() == null || config.apiKey().isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "OpenRouter is not configured. Add an API key in Admin Server Settings or the server environment.");
        }
        if (count <= 0) return List.of();

        List<GeneratedQuestion> result = new ArrayList<>();
        int attempts = 0;
        int maxAttempts = Math.min(2, Math.max(1, (count / 8) + 1));
        while (result.size() < count && attempts < maxAttempts) {
            attempts++;
            int batchSize = Math.min(10, count - result.size());
            List<GeneratedQuestion> batch = generateBatch(subject, batchSize, extraInstructions, config.apiKey(), config.model());
            if (batch.isEmpty()) continue;
            result.addAll(batch);
        }
        if (result.size() < count) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "OpenRouter could generate only " + result.size() + " of " + count + " required " + subject + " questions.");
        }
        return List.copyOf(result.subList(0, count));
    }

    private String extractJson(String text) {
        if (text == null) return "{}";
        String value = text.trim();
        if (value.startsWith("```json")) value = value.substring(7);
        else if (value.startsWith("```")) value = value.substring(3);
        if (value.endsWith("```")) value = value.substring(0, value.length() - 3);
        value = value.trim();
        int start = value.indexOf('{');
        int end = value.lastIndexOf('}');
        return start >= 0 && end > start ? value.substring(start, end + 1) : value;
    }

    private List<GeneratedQuestion> generateBatch(String subject, int count, String extra, String apiKey, String model) {
        String prompt = """
                Create exactly %d original, technically accurate ECET diploma entrance MCQs for subject %s.
                Target Andhra Pradesh ECET diploma-level candidates. Questions must be clear and unambiguous.
                Return ONLY a JSON object: {"questions":[{"questionText":"...","explanation":"...","difficulty":"EASY|MEDIUM|HARD",
                "options":[{"text":"...","correct":false},{"text":"...","correct":true},{"text":"...","correct":false},{"text":"...","correct":false}]}]}
                Every question must have exactly four distinct options and exactly one correct option.
                Do not number questions, use markdown, or repeat questions.
                Additional focus: %s
                """.formatted(count, subject, extra == null || extra.isBlank() ? "Follow the standard subject syllabus." : extra);

        Map<String,Object> body = new HashMap<>();
        body.put("model", model);
        body.put("temperature", 0.25);
        body.put("messages", List.of(
                Map.of("role", "system", "content", "You are an expert ECET question-paper setter. Return only raw JSON."),
                Map.of("role", "user", "content", prompt)));

        try {
            String raw = client.post().uri("/chat/completions")
                    .header("Authorization", "Bearer " + apiKey)
                    .header("HTTP-Referer", "https://github.com/nagachaitanyaappana/ECET-Deck")
                    .header("X-Title", "Paradox ECET Deck")
                    .body(body).retrieve().body(String.class);
            JsonNode root = mapper.readTree(raw);
            String content = root.path("choices").path(0).path("message").path("content").asText();
            JsonNode questions = mapper.readTree(extractJson(content)).path("questions");
            if (!questions.isArray()) return List.of();
            List<GeneratedQuestion> parsed = new ArrayList<>();
            for (JsonNode q : questions) {
                if (parsed.size() >= count) break;
                JsonNode options = q.path("options");
                if (!options.isArray() || options.size() != 4) continue;
                List<GeneratedOption> parsedOptions = new ArrayList<>();
                Set<String> uniqueOptions = new HashSet<>();
                int correct = 0;
                boolean valid = true;
                for (JsonNode option : options) {
                    String optionText = option.path("text").asText("").trim();
                    boolean isCorrect = option.path("correct").asBoolean(false);
                    if (optionText.isBlank() || !uniqueOptions.add(optionText.toLowerCase(Locale.ROOT))) valid = false;
                    if (isCorrect) correct++;
                    parsedOptions.add(new GeneratedOption(optionText, isCorrect));
                }
                String questionText = q.path("questionText").asText("").trim();
                if (!valid || correct != 1 || questionText.isBlank()) continue;
                String difficulty = q.path("difficulty").asText("MEDIUM").toUpperCase(Locale.ROOT);
                if (!Set.of("EASY", "MEDIUM", "HARD").contains(difficulty)) difficulty = "MEDIUM";
                parsed.add(new GeneratedQuestion(questionText, q.path("explanation").asText(""), difficulty, parsedOptions));
            }
            return parsed;
        } catch (RestClientResponseException ex) {
            log.error("OpenRouter API error (HTTP {}): {}", ex.getStatusCode(), ex.getResponseBodyAsString());
            int code = ex.getStatusCode().value();
            if (code == 401) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                        "OpenRouter API key is invalid or expired. Please update it in Admin Server Settings.");
            }
            if (code == 402 || code == 403) {
                if (!"openrouter/free".equalsIgnoreCase(model)) {
                    log.info("Model {} returned HTTP {}; retrying with openrouter/free", model, code);
                    return generateBatch(subject, count, extra, apiKey, "openrouter/free");
                }
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                        "OpenRouter error: Your account has $0 balance or model '" + model + "' requires paid credits.");
            }
            if (code == 429) {
                throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                        "OpenRouter rate limit reached. Please wait a moment and try again.");
            }
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "OpenRouter API error (HTTP " + code + "): " + ex.getStatusText());
        } catch (Exception ex) {
            log.warn("Failed generating batch for {}: {}", subject, ex.getMessage());
            return List.of();
        }
    }

    public record GeneratedQuestion(String questionText, String explanation, String difficulty, List<GeneratedOption> options) {}
    public record GeneratedOption(String text, boolean correct) {}
}
