package com.plotforge.user.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CurrentUserResponse {
    private Long id;
    private String fullName;
    private String username;
    private String email;
    private LocalDateTime createdAt;
}
