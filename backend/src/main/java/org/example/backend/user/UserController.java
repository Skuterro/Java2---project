package org.example.backend.user;

import jakarta.annotation.Nonnull;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.backend.auth.AuthenticationRequest;
import org.example.backend.auth.AuthenticationResponse;
import org.example.backend.auth.AuthenticationService;
import org.example.backend.config.JwtService;
import org.example.backend.exceptions.TokenNotValidException;
import org.example.backend.exceptions.UserNotExistException;
import org.example.backend.item.mapper.ItemMapper;
import org.example.backend.item.mapper.ItemMapperJpa;
import org.example.backend.item.model.Item;
import org.example.backend.item.model.ItemEntity;
import org.example.backend.item.model.ItemSaveForm;
import org.example.backend.item.repository.ItemRepository;
import org.example.backend.item.service.ItemService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {
    private final AuthenticationService authenticationService;
    private final ItemRepository itemRepository;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final ItemMapperJpa itemMapperJpa;

    @GetMapping("/items")
    public ResponseEntity<List<Item>> getUserItems(@Nonnull HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");
        final String jwtToken;
        final String username;

        if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
            throw new TokenNotValidException("Zly token");
        }

        jwtToken = authHeader.substring(7);
        username = jwtService.extractUsername(jwtToken);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotExistException("Użytkownik o podanej nazwie nie istnieje"));

        List<ItemEntity> items = user.getItems();
        Page<ItemEntity> itemsPage = new PageImpl<>(items, Pageable.unpaged(), items.size());

        List<Item> itemList = itemMapperJpa.toItemList(itemsPage);
        return ResponseEntity.ok(itemList);
    }

    @GetMapping("/sell/{id}")
    public ResponseEntity<String> sellById(
            @PathVariable("id") String itemId,
            @Nonnull HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");
        final String jwtToken;
        final String username;

        if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
            throw new TokenNotValidException("Zly token");
        }

        jwtToken = authHeader.substring(7);
        username = jwtService.extractUsername(jwtToken);

        if(username == null){
            throw new TokenNotValidException("Błędny token.");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotExistException("Użytkownik o podanej nazwie nie istnieje"));

        ItemEntity itemToSell = user.getItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new InternalError("Item not found."));

        user.getItems().remove(itemToSell);
        user.setBalance((float) (user.getBalance() + itemToSell.getPrice()));
        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.OK).body("Success");
    }
}
