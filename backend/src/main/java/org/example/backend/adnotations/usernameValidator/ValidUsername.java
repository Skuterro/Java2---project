package org.example.backend.adnotations.usernameValidator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = UsernameValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME) 
public @interface ValidUsername {
    String message() default "Username must be 5-15 characters long and contain only letters and digits.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
