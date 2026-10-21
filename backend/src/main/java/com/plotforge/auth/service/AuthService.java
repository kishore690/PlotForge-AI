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
import com.plotforge.common.exception.DuplicateResourceException;
import com.plotforge.common.exception.InvalidCredentialsException;
import java.util.Locale;
import java.util.UUID;
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
        throw new DuplicateResourceException("Email already exists.");
    }

    // Check if username already exists
    if (userRepository.existsByUsername(request.getUsername())) {
        throw new DuplicateResourceException("Username already exists.");
    }

    // Create new user
    user newUser = user.builder()
            .fullName(request.getFullName())
            .username(request.getUsername())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(role.USER)
            .build();

    // Save the account before issuing its authentication token.
    user savedUser = userRepository.save(newUser);
    String token = jwtService.generateToken(savedUser.getUsername());

    // Return response
    return AuthResponse.builder()
            .message("Registration successful!")
            .token(token)
            .build();
}
public AuthResponse login(LoginRequest request) {

    // Find user by email
    user existingUser = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

    // Check password
    if (!passwordEncoder.matches(request.getPassword(), existingUser.getPassword())) {
        throw new InvalidCredentialsException("Invalid email or password");
    }

    // Generate JWT using username
    // (your JWT system still uses username internally)
    String token = jwtService.generateToken(existingUser.getUsername());

    return AuthResponse.builder()
            .message("Login successful!")
            .token(token)
            .build();
}

public AuthResponse loginWithGoogle(String googleSubject, String email, String fullName) {
    if (googleSubject == null || googleSubject.isBlank() || email == null || email.isBlank()) {
        throw new InvalidCredentialsException("Google did not provide a valid account identity.");
    }

    user account = userRepository.findByGoogleSubject(googleSubject).orElse(null);
    if (account == null) {
        account = userRepository.findByEmail(email.toLowerCase(Locale.ROOT)).orElse(null);
        if (account != null) {
            if (account.getGoogleSubject() != null && !account.getGoogleSubject().equals(googleSubject)) {
                throw new InvalidCredentialsException("This email is linked to a different Google account.");
            }
            account.setGoogleSubject(googleSubject);
            account = userRepository.save(account);
        } else {
            String username = createGoogleUsername(email);
            String name = fullName == null || fullName.isBlank() ? username : fullName.trim();
            account = userRepository.save(user.builder()
                    .fullName(name)
                    .username(username)
                    .email(email.toLowerCase(Locale.ROOT))
                    .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                    .googleSubject(googleSubject)
                    .role(role.USER)
                    .build());
        }
    }

    return AuthResponse.builder()
            .message("Google sign-in successful!")
            .token(jwtService.generateToken(account.getUsername()))
            .build();
}

private String createGoogleUsername(String email) {
    String localPart = email.substring(0, email.indexOf('@')).toLowerCase(Locale.ROOT);
    String base = localPart.replaceAll("[^a-z0-9._-]", "-");
    if (base.isBlank()) base = "writer";
    if (base.length() > 36) base = base.substring(0, 36);

    String candidate = base;
    int suffix = 1;
    while (userRepository.existsByUsername(candidate)) {
        String ending = "-" + suffix++;
        candidate = base.substring(0, Math.min(base.length(), 40 - ending.length())) + ending;
    }
    return candidate;
}

}
