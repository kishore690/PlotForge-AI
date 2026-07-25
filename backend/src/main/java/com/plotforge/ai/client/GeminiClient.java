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

@Component
public class GeminiClient {

    private final RestTemplate restTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.key}")
    private String apiKey;

    public GeminiClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String generateStory(String prompt) {

        String url =
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key="
                        + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String body = """
                {
                  "contents": [
                    {
                      "parts": [
                        {
                          "text": "%s"
                        }
                      ]
                    }
                  ]
                }
                """.formatted(prompt);

        HttpEntity<String> request =
                new HttpEntity<>(body, headers);

        try {

            ResponseEntity<String> response =
                    restTemplate.postForEntity(
                            url,
                            request,
                            String.class
                    );

            JsonNode root =
                    objectMapper.readTree(response.getBody());

            return root
                    .path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

        } catch (HttpStatusCodeException e) {

            System.out.println(e.getResponseBodyAsString());

            return e.getResponseBodyAsString();

        } catch (Exception e) {

            e.printStackTrace();

            return e.getMessage();
        }
    }
}