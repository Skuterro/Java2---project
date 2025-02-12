package org.example.backend.auth;

import jakarta.annotation.Nonnull;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backend.config.JwtService;
import org.example.backend.email.EmailService;
import org.example.backend.exceptions.*;
import org.example.backend.image.service.ImageService;
import org.example.backend.user.Role;
import org.example.backend.user.User;
import org.example.backend.user.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CookieValue;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final ImageService imageService;

    public AuthenticationResponse verify(@Nonnull HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");
        final String jwtToken;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return AuthenticationResponse.builder().status(400).build();
        }

        jwtToken = authHeader.substring(7);
        String username = jwtService.extractUsername(jwtToken);

        if (username == null) {
            throw new TokenNotValidException("Błędny token.");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotExistException("Użytkownik nie istnieje"));

        return AuthenticationResponse.builder()
                .userId(user.getId())
                .imageId(user.getImageId())
                .token(jwtToken)
                .email(user.getEmail())
                .username(username)
                .balance(user.getBalance())
                .status(200)
                .build();
    }

    public AuthenticationResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Użytkownik o takim email już istnieje.");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Użytkownik o takiej nazwie już istnieje.");
        }

        String token = UUID.randomUUID().toString();
        String confirmationLink = "http://localhost:8080/api/v1/auth/confirm?token=" + token;
        emailService.sendEmail(request.getEmail(), "Potwierdzenie rejestracji", "Kliknij w link, aby potwierdzić email: " + confirmationLink);

        var user = User.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .balance(0f)
                .imageId(imageService.getDefaultImage().getImageId())
                .role(Role.USER)
                .confirmationToken(token)
                .cases_opened(0)
                .profit(0.0)
                .build();
        userRepository.save(user);

        return AuthenticationResponse.builder().status(200).build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request, HttpServletResponse response) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
        } catch (DisabledException exception) {
            throw new UserNotEnabledException("Użytkownik nie jest aktywowany.");
        } catch (BadCredentialsException exception) {
            throw new UsernameOrPasswordNotValidException("Nieprawidłowa nazwa użytkownika lub hasło.");
        }

        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("Użytkownik nie znaleziony"));

        if (!user.isEnabled()) {
            return AuthenticationResponse.builder().status(400).build();
        }

        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        response.addHeader("Set-Cookie", "refreshToken=" + refreshToken + "; HttpOnly; Secure; Path=/api/auth/refresh; Max-Age=604800");

        return AuthenticationResponse.builder()
                .token(accessToken)
                .status(200)
                .build();
    }

    public AuthenticationResponse refresh(@CookieValue(name = "refreshToken", required = false) String refreshToken) {
        if (refreshToken == null) {
            throw new TokenNotValidException("Brak refresh tokena.");
        }

        String username = jwtService.extractUsername(refreshToken);
        if (username == null) {
            throw new TokenNotValidException("Błędny refresh token.");
        }

        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Użytkownik nie znaleziony"));

        if (!refreshToken.equals(user.getRefreshToken())) {
            throw new TokenNotValidException("Refresh token nie pasuje.");
        }

        String newAccessToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(newAccessToken)
                .status(200)
                .build();
    }

    public void logout(User user, HttpServletResponse response) {
        user.setRefreshToken(null);
        userRepository.save(user);

        response.addHeader("Set-Cookie", "refreshToken=; HttpOnly; Secure; Path=/api/auth/refresh; Max-Age=0");
    }
}
