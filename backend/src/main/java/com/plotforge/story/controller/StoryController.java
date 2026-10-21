package com.plotforge.story.controller;

import com.plotforge.story.dto.CreateStoryRequest;
import com.plotforge.story.dto.StoryResponse;
import com.plotforge.story.dto.UpdateStoryRequest;
import com.plotforge.story.dto.ImportStoryRequest;
import com.plotforge.story.service.StoryService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/story")
public class StoryController {

    private final StoryService storyService;

    public StoryController(StoryService storyService) {
        this.storyService = storyService;
    }

    @PostMapping("/create")
    public StoryResponse createStory(
            @Valid @RequestBody CreateStoryRequest request,
            Authentication authentication) {

        return storyService.createStory(
                request,
                authentication.getName()
        );
    }

    @PostMapping("/import")
    public StoryResponse importStory(
            @Valid @RequestBody ImportStoryRequest request,
            Authentication authentication) {
        return storyService.importStory(request, authentication.getName());
    }

    @GetMapping("/my-stories")
    public List<StoryResponse> getMyStories(Authentication authentication) {

        return storyService.getMyStories(authentication.getName());
    }

    @GetMapping("/{id}")
    public StoryResponse getStoryById(
            @PathVariable Long id,
            Authentication authentication) {

        return storyService.getStoryById(
                id,
                authentication.getName()
        );
    }

    @PutMapping("/{id}")
    public StoryResponse updateStory(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStoryRequest request,
            Authentication authentication) {

        return storyService.updateStory(
                id,
                request,
                authentication.getName()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStory(
            @PathVariable Long id,
            Authentication authentication) {

        storyService.deleteStory(id, authentication.getName());

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/generate")
    public ResponseEntity<StoryResponse> generateStory(
            @PathVariable Long id,
            Authentication authentication) {

        StoryResponse response =
                storyService.generateStory(
                        id,
                        authentication.getName()
                );

        return ResponseEntity.ok(response);
    }
}
