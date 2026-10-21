package com.plotforge.story.service;

import com.plotforge.ai.service.GeminiService;
import com.plotforge.common.exception.AiGenerationException;
import com.plotforge.common.exception.ResourceNotFoundException;
import com.plotforge.story.dto.CreateStoryRequest;
import com.plotforge.story.dto.StoryResponse;
import com.plotforge.story.dto.UpdateStoryRequest;
import com.plotforge.story.dto.ImportStoryRequest;
import com.plotforge.story.entity.Story;
import com.plotforge.story.entity.StoryStatus;
import com.plotforge.story.repository.StoryRepository;
import com.plotforge.user.entity.user;
import com.plotforge.user.repository.userRepository;
import org.springframework.stereotype.Service;

import java.util.List;

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
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Story story = Story.builder()
                .title(request.getTitle())
                .prompt(request.getPrompt())
                .genre(request.getGenre())

                // Story Settings
                .length(request.getLength())
                .style(request.getStyle())
                .audience(request.getAudience())
                .language(request.getLanguage())
                .creativity(request.getCreativity())
                .complexity(request.getComplexity())
                .characterCount(request.getCharacterCount())
                .autoCharacters(request.getAutoCharacters())
                .autoWorld(request.getAutoWorld())
                .characters(request.getCharacters())
                .world(request.getWorld())
                .favorite(false)
                .saved(false)

                .status(StoryStatus.DRAFT)
                .generatedStory("")
                .user(existingUser)
                .build();

        Story savedStory = storyRepository.save(story);

        return mapToResponse(savedStory);
    }

    public StoryResponse importStory(ImportStoryRequest request, String username) {
        user existingUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Story story = Story.builder()
                .title(request.getTitle().trim())
                .prompt("Imported story")
                .generatedStory(request.getGeneratedStory())
                .genre(request.getGenre() == null || request.getGenre().isBlank() ? "Imported" : request.getGenre().trim())
                .length("Medium")
                .style("Imported")
                .audience("Adult")
                .language("English")
                .creativity(0)
                .complexity("Imported")
                .characterCount(0)
                .autoCharacters(false)
                .autoWorld(false)
                .favorite(false)
                .saved(false)
                .status(StoryStatus.COMPLETED)
                .user(existingUser)
                .build();

        return mapToResponse(storyRepository.save(story));
    }

    // ==========================
    // Get My Stories
    // ==========================
    public List<StoryResponse> getMyStories(String username) {

        user existingUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Story> stories = storyRepository.findByUser(existingUser);

        return stories.stream()
                .map(this::mapToResponse)
                .toList();
    }

    public StoryResponse getStoryById(Long id, String username) {

        // Find the logged-in user
        user existingUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Find the story that belongs to this user
        Story story = storyRepository.findByIdAndUser(id, existingUser)
                .orElseThrow(() -> new ResourceNotFoundException("Story not found"));

        return mapToResponse(story);
    }

    public StoryResponse updateStory(
            Long id,
            UpdateStoryRequest request,
            String username) {

        // Find logged-in user
        user existingUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Find story owned by the user
        Story story = storyRepository.findByIdAndUser(id, existingUser)
                .orElseThrow(() -> new ResourceNotFoundException("Story not found"));

        // Update fields
        if (request.getTitle() != null) story.setTitle(request.getTitle());
        if (request.getPrompt() != null) story.setPrompt(request.getPrompt());
        if (request.getGenre() != null) story.setGenre(request.getGenre());
        if (request.getLength() != null) story.setLength(request.getLength());
        if (request.getStyle() != null) story.setStyle(request.getStyle());
        if (request.getAudience() != null) story.setAudience(request.getAudience());
        if (request.getLanguage() != null) story.setLanguage(request.getLanguage());
        if (request.getCreativity() != null) story.setCreativity(request.getCreativity());
        if (request.getComplexity() != null) story.setComplexity(request.getComplexity());
        if (request.getCharacterCount() != null) story.setCharacterCount(request.getCharacterCount());
        if (request.getAutoCharacters() != null) story.setAutoCharacters(request.getAutoCharacters());
        if (request.getAutoWorld() != null) story.setAutoWorld(request.getAutoWorld());
        if (request.getCharacters() != null) story.setCharacters(request.getCharacters());
        if (request.getWorld() != null) story.setWorld(request.getWorld());
        if (request.getFavorite() != null) story.setFavorite(request.getFavorite());
        if (request.getSaved() != null) story.setSaved(request.getSaved());

        // Save updated story
        Story updatedStory = storyRepository.save(story);

        return mapToResponse(updatedStory);
    }

    public void deleteStory(Long id, String username) {

        // Find logged-in user
        user existingUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Find story owned by the user
        Story story = storyRepository.findByIdAndUser(id, existingUser)
                .orElseThrow(() -> new ResourceNotFoundException("Story not found"));

        // Delete the story
        storyRepository.delete(story);
    }

    public StoryResponse generateStory(Long id, String username) {

        // Find logged-in user
        user existingUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Find story belonging to the user
        Story story = storyRepository.findByIdAndUser(id, existingUser)
                .orElseThrow(() -> new ResourceNotFoundException("Story not found"));

        try {

            // Generate AI story
            String aiStory = geminiService.generateStory(story);

            // Save generated story
            story.setGeneratedStory(aiStory);

            // Mark as completed
            story.setStatus(StoryStatus.COMPLETED);

            // Save in database
            Story savedStory = storyRepository.save(story);

            return mapToResponse(savedStory);

        } catch (AiGenerationException e) {

            throw e;

        } catch (Exception e) {

            throw new AiGenerationException(
                    "Failed to generate story: " + e.getMessage(), e
            );
        }
    }

    private StoryResponse mapToResponse(Story story) {

        return StoryResponse.builder()
                .id(story.getId())
                .title(story.getTitle())
                .prompt(story.getPrompt())
                .generatedStory(story.getGeneratedStory())
                .genre(story.getGenre())

                .length(story.getLength())
                .style(story.getStyle())
                .audience(story.getAudience())
                .language(story.getLanguage())
                .creativity(story.getCreativity())
                .complexity(story.getComplexity())
                .characterCount(story.getCharacterCount())
                .autoCharacters(story.getAutoCharacters())
                .autoWorld(story.getAutoWorld())
                .characters(story.getCharacters())
                .world(story.getWorld())
                .favorite(story.getFavorite())
                .saved(story.getSaved())

                .status(story.getStatus().name())
                .createdAt(story.getCreatedAt())
                .updatedAt(story.getUpdatedAt())
                .build();
    }

}
