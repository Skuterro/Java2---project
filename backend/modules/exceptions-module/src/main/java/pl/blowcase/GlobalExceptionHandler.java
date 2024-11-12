package pl.blowcase;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import pl.blowcase.auth.AuthenticationResponse;
import pl.blowcase.exceptions.UserAlreadyExistsException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<AuthenticationResponse> handleUserAlreadyExistsException(UserAlreadyExistsException e) {
        AuthenticationResponse response = new AuthenticationResponse(null, null, null, null, e.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(UserNotExistException.class)
    public ResponseEntity<AuthenticationResponse> handleUserNotExist(UserNotExistException e) {
        AuthenticationResponse response = new AuthenticationResponse(null, null, null,null,  e.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(TokenNotValidException.class)
    public ResponseEntity<AuthenticationResponse> handleTokenNotValidException(TokenNotValidException e) {
        AuthenticationResponse response = new AuthenticationResponse(null, null, null, null, e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        return new ResponseEntity<>(errors, new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    //    @ExceptionHandler(Exception.class)
    public ResponseEntity<AuthenticationResponse> handleException(Exception e) {
        e.printStackTrace();
        AuthenticationResponse response = new AuthenticationResponse(null, null, null,null,  "Wystąpił błąd podczas przetwarzania żądania.");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

}
