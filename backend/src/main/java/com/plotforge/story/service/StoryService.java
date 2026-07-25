package com.plotforge.story.service;

import com.plotforge.story.dto.CreateStoryRequest;
import com.plotforge.story.dto.StoryResponse;
import com.plotforge.story.dto.UpdateStoryRequest;
import com.plotforge.story.entity.Story;
import com.plotforge.story.entity.StoryStatus;
import com.plotforge.story.repository.StoryRepository;
import com.plotforge.user.entity.user;
import com.plotforge.user.repository.userRepository;
import org.springframework.stereotype.Service;
import com.plotforge.story.dto.UpdateStoryRequest;
import java.util.List;
import com.plotforge.ai.service.GeminiService;
@Service
public class StoryService {

    private final StoryRepository storyRepository;
    private final userRepository userRepository;
    private final GeminiService geminiService;
    public StoryService(
            StoryRepository storyRepository,
            userRepository userRepository,
            GeminiService geminiService) {

        this.storyRepository = storyRepository;
        this.userRepository = userRepository;
        this.geminiService = geminiService;
    }

    // ==========================
    // Create Story
    // ==========================
    public StoryResponse createStory(
            CreateStoryRequest request,
            String username) {

        user existingUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Story story = Story.builder()
                .title(request.getTitle())
                .prompt(request.getPrompt())
                .genre(request.getGenre())
                .status(StoryStatus.DRAFT)
                .generatedStory("")
                .user(existingUser)
                .build();

        Story savedStory = storyRepository.save(story);

        return StoryResponse.builder()
                .id(savedStory.getId())
                .title(savedStory.getTitle())
                .prompt(savedStory.getPrompt())
                .generatedStory(savedStory.getGeneratedStory())
                .genre(savedStory.getGenre())
                .status(savedStory.getStatus().name())
                .createdAt(savedStory.getCreatedAt())
                .updatedAt(savedStory.getUpdatedAt())
                .build();
    }

    // ==========================
    // Get My Stories
    // ==========================
    public List<StoryResponse> getMyStories(String username) {

        user existingUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Story> stories = storyRepository.findByUser(existingUser);

        return stories.stream()
                .map(story -> StoryResponse.builder()
                        .id(story.getId())
                        .title(story.getTitle())
                        .prompt(story.getPrompt())
                        .generatedStory(story.getGeneratedStory())
                        .genre(story.getGenre())
                        .status(story.getStatus().name())
                        .createdAt(story.getCreatedAt())
                        .updatedAt(story.getUpdatedAt())
                        .build())
                .toList();
    }
    public StoryResponse getStoryById(Long id, String username) {

    // Find the logged-in user
    user existingUser = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // Find the story that belongs to this user
    Story story = storyRepository.findByIdAndUser(id, existingUser)
            .orElseThrow(() -> new RuntimeException("Story not found"));

    // Convert Entity → DTO
    return StoryResponse.builder()
            .id(story.getId())
            .title(story.getTitle())
            .prompt(story.getPrompt())
            .generatedStory(story.getGeneratedStory())
            .genre(story.getGenre())
            .status(story.getStatus().name())
            .createdAt(story.getCreatedAt())
            .updatedAt(story.getUpdatedAt())
            .build();
        }
        public StoryResponse updateStory(
        Long id,
        UpdateStoryRequest request,
        String username) {

    // Find logged-in user
    user existingUser = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // Find story owned by the user
    Story story = storyRepository.findByIdAndUser(id, existingUser)
            .orElseThrow(() -> new RuntimeException("Story not found"));

    // Update fields
    story.setTitle(request.getTitle());
    story.setPrompt(request.getPrompt());
    story.setGenre(request.getGenre());

    // Save updated story
    Story updatedStory = storyRepository.save(story);

    // Return response
    return StoryResponse.builder()
            .id(updatedStory.getId())
            .title(updatedStory.getTitle())
            .prompt(updatedStory.getPrompt())
            .generatedStory(updatedStory.getGeneratedStory())
            .genre(updatedStory.getGenre())
            .status(updatedStory.getStatus().name())
            .createdAt(updatedStory.getCreatedAt())
            .updatedAt(updatedStory.getUpdatedAt())
            .build();
        }
        public void deleteStory(Long id, String username) {

    // Find logged-in user
        user existingUser = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // Find story owned by the user
        Story story = storyRepository.findByIdAndUser(id, existingUser)
            .orElseThrow(() -> new RuntimeException("Story not found"));

    // Delete the story
        storyRepository.delete(story);
        }
        public StoryResponse generateStory(Long id, String username) {

    // Find logged-in user
    user existingUser = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // Find story belonging to the user
    Story story = storyRepository.findByIdAndUser(id, existingUser)
            .orElseThrow(() -> new RuntimeException("Story not found"));

    try {

        // Generate AI story
        String aiStory = geminiService.generateStory(story.getPrompt());

        // Save generated story
        story.setGeneratedStory(aiStory);

        // Mark as completed
        story.setStatus(StoryStatus.COMPLETED);

        // Save in database
        Story savedStory = storyRepository.save(story);

        // Return response
        return StoryResponse.builder()
                .id(savedStory.getId())
                .title(savedStory.getTitle())
                .prompt(savedStory.getPrompt())
                .generatedStory(savedStory.getGeneratedStory())
                .genre(savedStory.getGenre())
                .status(savedStory.getStatus().name())
                .createdAt(savedStory.getCreatedAt())
                .updatedAt(savedStory.getUpdatedAt())
                .build();

    } catch (Exception e) {

        // Do not save anything if Gemini fails
        throw new RuntimeException(
                "Gemini AI is currently unavailable. Please try again in a few moments."
        );
    }
}
}