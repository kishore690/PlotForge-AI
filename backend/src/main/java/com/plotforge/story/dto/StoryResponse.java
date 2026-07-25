package com.plotforge.story.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class StoryResponse {

    private Long id;

    private String title;

    private String prompt;

    private String generatedStory;

    private String genre;

    private String status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}