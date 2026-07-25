package com.plotforge.story.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateStoryRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Prompt is required")
    private String prompt;

    @NotBlank(message = "Genre is required")
    private String genre;
}