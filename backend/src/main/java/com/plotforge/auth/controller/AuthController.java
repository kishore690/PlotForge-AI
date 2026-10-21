package com.plotforge.auth.controller;

import com.plotforge.auth.dto.AuthResponse;
import com.plotforge.auth.dto.RegisterRequest;
import com.plotforge.auth.service.AuthService;
import com.plotforge.auth.service.GoogleIdentityService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import com.plotforge.auth.dto.LoginRequest;
import com.plotforge.auth.dto.GoogleAuthRequest;
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final GoogleIdentityService googleIdentityService;

    public AuthController(AuthService authService, GoogleIdentityService googleIdentityService) {
        this.authService = authService;
        this.googleIdentityService = googleIdentityService;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/google")
    public AuthResponse googleLogin(@Valid @RequestBody GoogleAuthRequest request) {
        return googleIdentityService.authenticate(request.getCredential());
    }

}
