package com.plotforge.story.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateStoryRequest {

    private String title;

    private String prompt;

    private String genre;

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
}
