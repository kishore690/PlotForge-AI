package com.plotforge.story.dto;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
public class CreateStoryRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Prompt is required")
    private String prompt;

    @NotBlank(message = "Genre is required")
    private String genre;

    private String length = "Medium";

    private String style = "Cinematic";

    private String audience = "Adult";

    private String language = "English";

    private Integer creativity = 65;

    private String complexity = "Moderate";

    private Integer characterCount = 2;

    private Boolean autoCharacters = true;

    private Boolean autoWorld = true;

    private String characters;

    private String world;
}
