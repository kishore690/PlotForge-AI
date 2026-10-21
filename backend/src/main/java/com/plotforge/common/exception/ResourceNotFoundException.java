package com.plotforge.common.exception;

/**
 * Thrown when a requested entity does not exist, or does not belong
 * to the current user. Mapped to HTTP 404 by GlobalExceptionHandler.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
