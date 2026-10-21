package com.plotforge.ai.service;

import com.plotforge.ai.client.GeminiClient;
import com.plotforge.story.entity.Story;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class GeminiService {

    private final GeminiClient geminiClient;

    public GeminiService(GeminiClient geminiClient) {
        this.geminiClient = geminiClient;
    }

    public String generateStory(Story story) {
        String characters = Objects.toString(story.getCharacters(), "[]");
        String world = Objects.toString(story.getWorld(), "{}");
        boolean generateCharacters = Boolean.TRUE.equals(story.getAutoCharacters());
        boolean generateWorld = Boolean.TRUE.equals(story.getAutoWorld());
        int characterCount = story.getCharacterCount() == null ? 2 : story.getCharacterCount();

        String characterInstructions = generateCharacters
                ? "Invent " + characterCount + " original, distinct characters that fit the story."
                : "Use these character profiles, preserve every specified detail, and invent suitable details for blank fields or empty profiles. "
                        + "The requested character count is " + characterCount + ":\n" + characters;
        String worldInstructions = generateWorld
                ? "Invent a coherent setting that fits the premise and genre."
                : "Use these user-defined world details as canon; do not contradict them:\n" + world;

        String finalPrompt = """
                You are a professional novelist. Write a complete, engaging story from the user's idea.

                Story idea:
                %s

                Genre: %s
                Length: %s
                Writing style: %s
                Intended audience: %s
                Language: %s
                Creativity: %d/100
                Complexity: %s

                Character instructions:
                %s

                World instructions:
                %s

                Requirements:
                - Respect every requested setting and keep the narrative internally consistent.
                - Write a complete story with a satisfying ending.
                - Return only the story, with no explanation or markdown.
                """.formatted(
                Objects.toString(story.getPrompt(), ""),
                Objects.toString(story.getGenre(), "Fantasy"),
                Objects.toString(story.getLength(), "Medium"),
                Objects.toString(story.getStyle(), "Cinematic"),
                Objects.toString(story.getAudience(), "Adult"),
                Objects.toString(story.getLanguage(), "English"),
                story.getCreativity() == null ? 65 : story.getCreativity(),
                Objects.toString(story.getComplexity(), "Moderate"),
                characterInstructions,
                worldInstructions);

        return geminiClient.generateStory(finalPrompt);
    }
}
