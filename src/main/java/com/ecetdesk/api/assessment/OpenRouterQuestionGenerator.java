package com.ecetdesk.api.assessment;

import java.util.*;
import java.time.Duration;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

@Service
public class OpenRouterQuestionGenerator {
    private final RestClient client;
    private final ObjectMapper mapper;
    private final String apiKey;
    private final String model;

    public OpenRouterQuestionGenerator(ObjectMapper mapper,
            @Value("${app.ai.openrouter.api-key:}") String apiKey,
            @Value("${app.ai.openrouter.model:openai/gpt-4o-mini}") String model) {
        this.mapper = mapper;
        this.apiKey = apiKey;
        this.model = model;
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(15));
        factory.setReadTimeout(Duration.ofSeconds(90));
        this.client = RestClient.builder()
            .requestFactory(factory)
            .baseUrl("https://openrouter.ai/api/v1")
            .build();
    }

    public List<GeneratedQuestion> generate(String subject, int count, String extraInstructions) {
        if (apiKey == null || apiKey.isBlank())
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "OpenRouter is not configured. Add OPENROUTER_API_KEY to your local .env file.");
        List<GeneratedQuestion> result = new ArrayList<>();
        while (result.size() < count) {
            int batch = Math.min(10, count - result.size());
            result.addAll(generateBatch(subject, batch, extraInstructions));
        }
        return result;
    }

    private List<GeneratedQuestion> generateBatch(String subject, int count, String extra) {
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
            "model", model,
            "temperature", 0.25,
            "response_format", Map.of("type","json_object"),
            "messages", List.of(
                Map.of("role","system","content","You are a careful ECET question-paper setter. Accuracy is more important than creativity."),
                Map.of("role","user","content",prompt)
            )
        );
        try {
            String raw = client.post().uri("/chat/completions")
                .header("Authorization","Bearer "+apiKey)
                .header("HTTP-Referer","https://github.com/nagachaitanyaappana/ECET-Deck")
                .header("X-Title","ECET Desk")
                .body(body).retrieve().body(String.class);
            JsonNode root = mapper.readTree(raw);
            String content = root.path("choices").path(0).path("message").path("content").asText();
            JsonNode questions = mapper.readTree(content).path("questions");
            if (!questions.isArray() || questions.size() != count)
                throw new IllegalStateException("The AI response did not contain the requested number of questions.");
            List<GeneratedQuestion> parsed = new ArrayList<>();
            for (JsonNode q : questions) {
                JsonNode options = q.path("options");
                if (!options.isArray() || options.size() != 4) throw new IllegalStateException("An AI question did not have four options.");
                List<GeneratedOption> parsedOptions = new ArrayList<>();
                int correct = 0;
                for (JsonNode option : options) {
                    boolean isCorrect = option.path("correct").asBoolean(false);
                    if (isCorrect) correct++;
                    String text = option.path("text").asText("").trim();
                    if (text.isBlank()) throw new IllegalStateException("An AI option was empty.");
                    parsedOptions.add(new GeneratedOption(text,isCorrect));
                }
                if (correct != 1) throw new IllegalStateException("An AI question did not have exactly one correct option.");
                String questionText=q.path("questionText").asText("").trim();
                String difficulty=q.path("difficulty").asText("MEDIUM").toUpperCase(Locale.ROOT);
                if(questionText.isBlank()) throw new IllegalStateException("An AI question was empty.");
                if(!Set.of("EASY","MEDIUM","HARD").contains(difficulty)) difficulty="MEDIUM";
                parsed.add(new GeneratedQuestion(questionText,q.path("explanation").asText(""),difficulty,parsedOptions));
            }
            return parsed;
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                "OpenRouter question generation failed or returned invalid JSON: "+ex.getMessage());
        }
    }

    public record GeneratedQuestion(String questionText,String explanation,String difficulty,List<GeneratedOption> options) {}
    public record GeneratedOption(String text,boolean correct) {}
}
