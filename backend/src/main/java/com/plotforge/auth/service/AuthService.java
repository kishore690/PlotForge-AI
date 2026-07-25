package com.plotforge.auth.service;

import com.plotforge.auth.dto.AuthResponse;
import com.plotforge.auth.dto.LoginRequest;
import com.plotforge.auth.dto.RegisterRequest;
import com.plotforge.user.entity.user;
import com.plotforge.user.repository.userRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.plotforge.user.entity.role;
import com.plotforge.security.JwtService;
@Service
public class AuthService {

    private final userRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    public AuthService(userRepository userRepository,
                   PasswordEncoder passwordEncoder,
                   JwtService jwtService) {

    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
}

    public AuthResponse register(RegisterRequest request) {

    // Check if email already exists
    if (userRepository.existsByEmail(request.getEmail())) {
        throw new RuntimeException("Email already exists.");
    }

    // Check if username already exists
    if (userRepository.existsByUsername(request.getUsername())) {
        throw new RuntimeException("Username already exists.");
    }

    // Create new user
    user newUser = user.builder()
            .fullName(request.getFullName())
            .username(request.getUsername())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(role.USER)
            .build();

    // Save to database
    userRepository.save(newUser);

    // Return response
    return AuthResponse.builder()
            .message("Registration successful!")
            .token("")
            .build();
}
public AuthResponse login(LoginRequest request) {

    // Find user by email
    user existingUser = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));

    // Check password
    if (!passwordEncoder.matches(request.getPassword(), existingUser.getPassword())) {
        throw new RuntimeException("Invalid email or password");
    }

    // Generate JWT using username
    // (your JWT system still uses username internally)
    String token = jwtService.generateToken(existingUser.getUsername());

    return AuthResponse.builder()
            .message("Login successful!")
            .token(token)
            .build();
}

}