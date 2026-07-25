package com.plotforge.dashboard.service;

import com.plotforge.dashboard.dto.DashboardResponse;
import com.plotforge.story.entity.Story;
import com.plotforge.story.entity.StoryStatus;
import com.plotforge.story.repository.StoryRepository;
import com.plotforge.user.entity.user;
import com.plotforge.user.repository.userRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    private final StoryRepository storyRepository;
    private final userRepository userRepository;

    public DashboardService(
            StoryRepository storyRepository,
            userRepository userRepository) {

        this.storyRepository = storyRepository;
        this.userRepository = userRepository;
    }

    public DashboardResponse getDashboard(String username) {

        user existingUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        long totalStories =
                storyRepository.countByUser(existingUser);

        long completedStories =
                storyRepository.countByUserAndStatus(
                        existingUser,
                        StoryStatus.COMPLETED
                );

        long draftStories =
                storyRepository.countByUserAndStatus(
                        existingUser,
                        StoryStatus.DRAFT
                );

        List<Story> stories =
                storyRepository.findByUser(existingUser);

        long totalWords = stories.stream()
                .map(Story::getGeneratedStory)
                .filter(s -> s != null && !s.isBlank())
                .mapToLong(s -> s.trim().split("\\s+").length)
                .sum();

        return DashboardResponse.builder()
                .totalStories(totalStories)
                .completedStories(completedStories)
                .draftStories(draftStories)
                .totalWords(totalWords)
                .build();
    }
}