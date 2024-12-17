package org.example.backend.auth;
import jakarta.annotation.Nonnull;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.connector.Response;
import org.example.backend.config.JwtService;
import org.example.backend.email.EmailService;
import org.example.backend.exceptions.TokenNotValidException;
import org.example.backend.exceptions.UserAlreadyExistsException;
import org.example.backend.exceptions.UserNotEnabledException;
import org.example.backend.exceptions.UserNotExistException;
import org.example.backend.user.Role;
import org.example.backend.user.User;
import org.example.backend.user.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final EmailService emailService;


    public AuthenticationResponse verify(@Nonnull HttpServletRequest request){

        final String authHeader = request.getHeader("Authorization");
        final String jwtToken;
        final String username;

        if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
            return AuthenticationResponse.builder().status(400).build();
        }

        jwtToken = authHeader.substring(7);
        username = jwtService.extractUsername(jwtToken);

        if(username == null){
            throw new TokenNotValidException("Błędny token.");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotExistException("Użytkownik o podanej nazwie nie istnieje"));

        return AuthenticationResponse.builder().token(jwtToken).email(user.getEmail()).username(username).balance(user.getBalance()).status(200).build();
    }

    public AuthenticationResponse register(RegisterRequest request) {
        if(userRepository.existsByEmail(request.getEmail())){
            throw new UserAlreadyExistsException("Uzytkownik pod takim adresem email juz istnieje.");
        }
        if(userRepository.existsByUsername(request.getUsername())){
            throw new UserAlreadyExistsException("Uzytkownik pod takim adresem email juz istnieje.");
        }

        String token = UUID.randomUUID().toString();

        String confirmationLink = "http://localhost:8080/api/v1/auth/confirm?token=" + token;
        emailService.sendEmail(request.getEmail(), "Potwierdzenie rejestracji",
                "Kliknij w link, aby potwierdzić swój email: " + confirmationLink);

        var user = User.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .balance(0f)
                .role(Role.USER)
                .confirmationToken(token)
                .build();
        userRepository.save(user);

        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse
                .builder()
                .email(user.getEmail())
                .token(jwtToken)
                .username(user.getUsername())
                .balance(user.getBalance())
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        var jwtToken = jwtService.generateToken(user);

        if(!user.isEnabled()){
            return AuthenticationResponse
                    .builder()
                    .token(jwtToken)
                    .status(400)
                    .build();
        }

        return AuthenticationResponse
                .builder()
                .token(jwtToken)
                .status(200)
                .build();
    }
}
