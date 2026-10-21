package com.plotforge.user.controller;

import com.plotforge.user.dto.CurrentUserResponse;
import com.plotforge.user.entity.user;
import com.plotforge.user.repository.userRepository;
import com.plotforge.common.exception.ResourceNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/user")
public class UserController {

    private final userRepository userRepository;

    public UserController(userRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public CurrentUserResponse getCurrentUser(Authentication authentication) {
        user currentUser = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return CurrentUserResponse.builder()
                .id(currentUser.getId())
                .fullName(currentUser.getFullName())
                .username(currentUser.getUsername())
                .email(currentUser.getEmail())
                .createdAt(currentUser.getCreatedAt())
                .build();
    }
}
