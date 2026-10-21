package com.plotforge.common.exception;

/**
 * Thrown when the AI provider cannot produce a story.
 * Mapped to HTTP 503 by GlobalExceptionHandler.
 */
public class AiGenerationException extends RuntimeException {

    public AiGenerationException(String message) {
        super(message);
    }

    public AiGenerationException(String message, Throwable cause) {
        super(message, cause);
    }
}
