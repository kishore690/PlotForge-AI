package com.plotforge.ai.controller;

import com.plotforge.ai.service.GeminiService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final GeminiService geminiService;

    public AiController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @GetMapping("/test")
    public String test(@RequestParam String prompt) {

        return geminiService.generateStory(prompt);

    }
}