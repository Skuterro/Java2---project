package org.example.backend.auth;

import lombok.RequiredArgsConstructor;
import org.example.backend.config.JwtService;
import org.example.backend.user.Role;
import org.example.backend.user.User;
import org.example.backend.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public ResponseEntity<AuthenticationResponse> validate(RegisterRequest request){
        try{
            if(!validateEmail(request.getEmail())){
                return ResponseEntity
                        .badRequest()
                        .body(new AuthenticationResponse(null, "Email jest niepoprawny"));
            }

            if(!validatePassword(request.getPassword())){
                return ResponseEntity
                        .badRequest()
                        .body(new AuthenticationResponse(null, "Hasło jest niepoprawne"));
            }

            if(userRepository.existsByEmail(request.getEmail())){
                return ResponseEntity
                        .badRequest()
                        .body(new AuthenticationResponse(null, "Uzytkownik pod takim adresem juz ustnieje"));
            }

            if(userRepository.existsByUsername(request.getUsername())){
                return ResponseEntity
                        .badRequest()
                        .body(new AuthenticationResponse(null, "Uzytkownik pod taką nazwą juz ustnieje"));
            }

            return ResponseEntity.ok(register(request));
        }
        catch(Exception e){
            System.out.println(e.toString());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new AuthenticationResponse(null, "Wystąpił błąd podczas rejestracji"));
        }
    }


    public Boolean validateEmail(String email) {
        if (email == null || email.isEmpty()) {
            return false;
        }
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\." +"[a-zA-Z0-9_+&*-]+)*@" + "(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        Pattern pattern = Pattern.compile(emailRegex);
        return pattern.matcher(email).matches();
    }

    public Boolean validatePassword(String password) {
        if (password == null || password.isEmpty()) {
            return false;
        }
        String regExpn = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,20}$";
        Pattern pattern = Pattern.compile(regExpn, Pattern.CASE_INSENSITIVE);
        return pattern.matcher(regExpn).matches();
    }

    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();
        userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse
                .builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByUsername(request.getEmail()).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse
                .builder()
                .token(jwtToken)
                .build();
    }
}
