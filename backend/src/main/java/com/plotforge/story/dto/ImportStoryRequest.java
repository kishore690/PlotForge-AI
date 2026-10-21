package com.plotforge.story.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ImportStoryRequest {
    @NotBlank(message = "Story title is required")
    private String title;

    @NotBlank(message = "Story text is required")
    private String generatedStory;

    private String genre = "Imported";
}
