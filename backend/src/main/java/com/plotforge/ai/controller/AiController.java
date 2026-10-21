package com.plotforge.ai.controller;

import com.plotforge.ai.service.GeminiService;
import com.plotforge.story.entity.Story;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final GeminiService geminiService;

    public AiController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @GetMapping("/test")
    public String test(@RequestParam String prompt) {

        Story story = new Story();

        story.setPrompt(prompt);
        story.setGenre("Fantasy");
        story.setLength("Medium");
        story.setStyle("Cinematic");
        story.setAudience("Adult");
        story.setLanguage("English");
        story.setCreativity(70);
        story.setComplexity("Moderate");
        story.setCharacters("");
        story.setWorld("");

        return geminiService.generateStory(story);
    }
}