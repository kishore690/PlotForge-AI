package com.plotforge.auth.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.plotforge.auth.dto.AuthResponse;
import com.plotforge.common.exception.InvalidCredentialsException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;

@Service
public class GoogleIdentityService {
    private final String clientId;
    private final AuthService authService;
    private volatile GoogleIdTokenVerifier verifier;

    public GoogleIdentityService(@Value("${google.client-id:}") String clientId, AuthService authService) {
        this.clientId = clientId == null ? "" : clientId.trim();
        this.authService = authService;
    }

    public AuthResponse authenticate(String credential) {
        if (clientId.isBlank()) {
            throw new InvalidCredentialsException("Google sign-in is not configured. Add the OAuth web client ID to the backend and frontend settings.");
        }

        try {
            GoogleIdToken idToken = verifier().verify(credential);
            if (idToken == null) {
                throw new InvalidCredentialsException("Google could not verify your sign-in. Please try again.");
            }
            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String hostedDomain = payload.getHostedDomain();
            boolean authoritativeEmail = email != null && email.toLowerCase().endsWith("@gmail.com");
            boolean verifiedWorkspaceEmail = Boolean.TRUE.equals(payload.getEmailVerified())
                    && hostedDomain != null && !hostedDomain.isBlank();

            if (!Boolean.TRUE.equals(payload.getEmailVerified()) || (!authoritativeEmail && !verifiedWorkspaceEmail)) {
                throw new InvalidCredentialsException("Use a verified Gmail or Google Workspace account for Google sign-in.");
            }

            Object nameClaim = payload.get("name");
            String fullName = nameClaim == null ? "" : nameClaim.toString();
            return authService.loginWithGoogle(payload.getSubject(), email, fullName);
        } catch (InvalidCredentialsException exception) {
            throw exception;
        } catch (IOException | GeneralSecurityException exception) {
            throw new InvalidCredentialsException("Google sign-in could not be verified. Please try again.");
        }
    }

    private GoogleIdTokenVerifier verifier() throws GeneralSecurityException, IOException {
        GoogleIdTokenVerifier current = verifier;
        if (current == null) {
            synchronized (this) {
                current = verifier;
                if (current == null) {
                    current = new GoogleIdTokenVerifier.Builder(
                            GoogleNetHttpTransport.newTrustedTransport(),
                            JacksonFactory.getDefaultInstance())
                            .setAudience(List.of(clientId))
                            .build();
                    verifier = current;
                }
            }
        }
        return current;
    }
}
