package org.example.backend.user;

import lombok.RequiredArgsConstructor;
import org.example.backend.item.model.Item;
import org.example.backend.item.model.ItemEntity;
import org.example.backend.item.repository.ItemRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;

    public void addItemToUser(String username, String itemId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Nie znaleziono użytkownika: " + username));

        ItemEntity item = itemRepository.findById(itemId);

        if (!user.getItems().contains(item)) {
            user.getItems().add(item);
            userRepository.save(user);
        } else {
            throw new IllegalArgumentException("Użytkownik już posiada ten przedmiot.");
        }
    }
}
