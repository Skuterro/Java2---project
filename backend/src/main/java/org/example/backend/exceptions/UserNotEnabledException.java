package org.example.backend.exceptions;

public class UserNotEnabledException extends RuntimeException {
    public UserNotEnabledException(String message) {
        super(message);
    }
}
