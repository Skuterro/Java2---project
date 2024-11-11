package org.example.backend.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Getter
@Setter
public class RegisterRequest {
    @NotBlank(message = "Email nie może być pusty.")
    @Email(message = "Email jest niepoprawny.")
    private String email;

    @NotBlank(message = "Hasło nie może być puste.")
    @Size(min = 8, max = 20, message = "Hasło musi mieć od 8 do 20 znaków.")
    private String password;

    @NotBlank(message = "Nazwa użytkownika nie może być pusta.")
    @Size(min = 3, max = 20, message = "Nazwa użytkownika musi mieć od 3 do 20 znaków.")
    private String username;
}
