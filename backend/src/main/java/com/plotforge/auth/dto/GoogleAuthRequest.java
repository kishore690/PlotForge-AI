package com.plotforge.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GoogleAuthRequest {
    @NotBlank(message = "Google credential is required")
    private String credential;
}
