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

    // Story Settings
    private String length;

    private String style;

    private String audience;

    private String language;

    private Integer creativity;

    private String complexity;

    private Integer characterCount;

    private Boolean autoCharacters;

    private Boolean autoWorld;

    private String characters;

    private String world;

    private Boolean favorite;

    private Boolean saved;

    private String status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
