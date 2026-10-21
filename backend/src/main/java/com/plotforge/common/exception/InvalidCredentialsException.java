package com.plotforge.common.exception;

/**
 * Thrown when login fails. Deliberately carries a generic message so the
 * response never reveals whether the email exists. Mapped to HTTP 401.
 */
public class InvalidCredentialsException extends RuntimeException {

    public InvalidCredentialsException(String message) {
        super(message);
    }
}
