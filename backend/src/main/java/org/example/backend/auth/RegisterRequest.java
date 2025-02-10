package org.example.backend.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.example.backend.adnotations.passwordValidator.ValidPassword;
import org.example.backend.adnotations.usernameValidator.ValidUsername;

@Data
@Getter
@Setter
public class RegisterRequest {
    @NotBlank(message = "Email nie może być pusty.")
    @Email(message = "Email jest niepoprawny.")
    private String email;

    @ValidPassword
    private String password;

    @ValidUsername
    private String username;
}
