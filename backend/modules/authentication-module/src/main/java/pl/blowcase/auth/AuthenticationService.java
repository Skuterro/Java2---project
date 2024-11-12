<<<<<<< HEAD:backend/modules/authentication-module/src/main/java/pl/blowcase/auth/AuthenticationService.java
package pl.blowcase.auth;

import config.JwtService;
import lombok.RequiredArgsConstructor;
=======
package org.example.backend.auth;
import jakarta.annotation.Nonnull;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.backend.config.JwtService;
import org.example.backend.exceptions.TokenNotValidException;
import org.example.backend.exceptions.UserAlreadyExistsException;
import org.example.backend.exceptions.UserNotExistException;
import org.example.backend.user.Role;
import org.example.backend.user.User;
import org.example.backend.user.UserRepository;
>>>>>>> 9c06ec8e95b8219887151a69ca15412be138383c:backend/src/main/java/org/example/backend/auth/AuthenticationService.java
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
<<<<<<< HEAD:backend/modules/authentication-module/src/main/java/pl/blowcase/auth/AuthenticationService.java
import pl.blowcase.exceptions.UserAlreadyExistsException;
import pl.blowcase.Role;
import pl.blowcase.User;
import pl.blowcase.UserRepository;
=======
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.Optional;
>>>>>>> 9c06ec8e95b8219887151a69ca15412be138383c:backend/src/main/java/org/example/backend/auth/AuthenticationService.java

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;


    public AuthenticationResponse verify(@Nonnull HttpServletRequest request){
        final String authHeader = request.getHeader("Authorization");
        final String jwtToken;
        final String username;

        if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
            return new AuthenticationResponse(null,null,null,null,"Brak tokenu.");
        }

        jwtToken = authHeader.substring(7);
        username = jwtService.extractUsername(jwtToken);

        if(username == null){
            throw new TokenNotValidException("Błędny token.");
        }

        UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

        if(!jwtService.isTokenValid(jwtToken, userDetails)) {
            throw new TokenNotValidException("Błędny token.");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotExistException("Użytkownik o podanej nazwie nie istnieje"));

        return new AuthenticationResponse(jwtToken, user.getEmail(), username, user.getBalance(), null);
    }

    public AuthenticationResponse register(RegisterRequest request) {
        if(userRepository.existsByEmail(request.getEmail())){
            throw new UserAlreadyExistsException("Uzytkownik pod takim adresem email juz istnieje.");
        }
        if(userRepository.existsByUsername(request.getUsername())){
            throw new UserAlreadyExistsException("Uzytkownik pod takim adresem email juz istnieje.");
        }

        var user = User.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .balance(0f)
                .role(Role.USER)
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