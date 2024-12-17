package org.example.backend.email;

import org.example.backend.user.User;
import org.example.backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class EmailController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/confirm")
    public EmailResponse confirmEmail(@RequestParam("token") String token) {

        User user = userRepository.findByConfirmationToken(token)
                .orElseThrow(() -> new RuntimeException("Token niepoprawny"));

        user.setEnabled(true);
        user.setConfirmationToken(null);
        userRepository.save(user);

        return EmailResponse.builder().message("Email potwierdzony, możesz się zalogować.").build();
    }
}
