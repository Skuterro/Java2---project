package org.example.backend.exceptions;

public class UsernameOrPasswordNotValidException extends RuntimeException {
    public UsernameOrPasswordNotValidException(String message) {
        super(message);
    }
}
