package com.plotforge.common.exception;

/**
 * Thrown when creating an entity that conflicts with an existing one,
 * such as a taken email or username. Mapped to HTTP 409.
 */
public class DuplicateResourceException extends RuntimeException {

    public DuplicateResourceException(String message) {
        super(message);
    }
}
