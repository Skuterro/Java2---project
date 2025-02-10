package org.example.backend.adnotations.passwordValidator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = PasswordValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPassword {
    String message() default "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one digit, and one special character.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
