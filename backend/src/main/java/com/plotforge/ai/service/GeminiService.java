package com.plotforge.ai.service;

import com.plotforge.ai.client.GeminiClient;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    private final GeminiClient geminiClient;

    public GeminiService(GeminiClient geminiClient) {
        this.geminiClient = geminiClient;
    }

    public String generateStory(String prompt) {

        String finalPrompt = """
                You are a professional story writer.

                Write a complete, engaging story based on the following details.

                Requirements:
                - Write at least 800 words.
                - Use proper paragraphs.
                - Give the story a satisfying ending.
                - Do not use markdown.
                - Return only the story.

                Story Prompt:
                %s
                """.formatted(prompt);

        return geminiClient.generateStory(finalPrompt);
    }
}