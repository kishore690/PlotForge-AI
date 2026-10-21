package com.plotforge.ai.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import com.plotforge.common.exception.AiGenerationException;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class GeminiClient {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.model:gemini-3.6-flash}")
    private String model;

    @Value("${gemini.api.fallback-models:gemini-3.5-flash-lite}")
    private String fallbackModels;

    @Value("${gemini.api.timeout-ms:120000}")
    private int timeoutMs;

    public GeminiClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String generateStory(String prompt) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = buildRequestBody(prompt);

        String jsonBody;
        try {
            jsonBody = objectMapper.writeValueAsString(requestBody);
        } catch (Exception e) {
            throw new AiGenerationException("Failed to serialize request body", e);
        }

        HttpEntity<String> request = new HttpEntity<>(jsonBody, headers);
        List<String> models = new java.util.ArrayList<>();
        models.add(model);
        for (String fallback : fallbackModels.split(",")) {
            String candidate = fallback.trim();
            if (!candidate.isBlank() && !models.contains(candidate)) models.add(candidate);
        }

        for (int index = 0; index < models.size(); index++) {
            String selectedModel = models.get(index);
            String url = "https://generativelanguage.googleapis.com/v1beta/models/"
                    + selectedModel + ":generateContent?key=" + apiKey;
            try {
                ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode candidates = root.path("candidates");
                if (candidates.isMissingNode() || candidates.isEmpty()) {
                    throw new AiGenerationException("No response from AI model");
                }
                JsonNode parts = candidates.get(0).path("content").path("parts");
                if (parts.isMissingNode() || parts.isEmpty()) {
                    throw new AiGenerationException("Empty response from AI model");
                }
                String text = parts.get(0).path("text").asText();
                if (text.isBlank()) throw new AiGenerationException("AI returned empty story");
                return text;
            } catch (HttpStatusCodeException e) {
                boolean transientCapacityError = e.getStatusCode().value() == 429 || e.getStatusCode().value() == 503;
                if (transientCapacityError && index + 1 < models.size()) {
                    System.err.println("Gemini model " + selectedModel + " is at capacity; trying fallback model.");
                    continue;
                }
                String errorBody = e.getResponseBodyAsString();
                System.err.println("Gemini API error from " + selectedModel + ": " + errorBody);
                throw new AiGenerationException("AI service error: " + errorBody, e);
            } catch (AiGenerationException e) {
                throw e;
            } catch (Exception e) {
                throw new AiGenerationException("Failed to generate story: " + e.getMessage(), e);
            }
        }

        throw new AiGenerationException("All configured AI models are currently unavailable");
    }

    private Map<String, Object> buildRequestBody(String prompt) {

        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);

        Map<String, Object> contentItem = new HashMap<>();
        contentItem.put("parts", Collections.singletonList(textPart));

        Map<String, Object> body = new HashMap<>();
        body.put("contents", Collections.singletonList(contentItem));

        return body;
    }
}
