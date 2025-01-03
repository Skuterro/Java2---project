package org.example.backend.UserItem.service;

import jakarta.annotation.Nonnull;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backend.UserItem.model.UserItem;
import org.example.backend.UserItem.model.UserItemDTO;
import org.example.backend.UserItem.repository.UserItemRepository;
import org.example.backend.item.model.ItemEntity;
import org.example.backend.item.repository.ItemRepositoryImpl;
import org.example.backend.user.User;
import org.example.backend.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Transactional
public class UserItemService {

    private final UserItemRepository userItemRepository;
    private final UserRepository userRepository;
    private final ItemRepositoryImpl itemRepositoryImpl;

    public ResponseEntity<String> sellUserItem(@PathVariable long id, @Nonnull HttpServletRequest request){
        User user =  (User) request.getAttribute("currentUser");

        Double itemPrice = Objects.requireNonNull(userItemRepository.findById(id).orElse(null)).getItem().getPrice();

        user.setBalance((float) (user.getBalance() +  itemPrice));

        userRepository.save(user);

        userItemRepository.deleteById(id);
        return ResponseEntity.status(HttpStatus.OK).body("Success");
    }
    public UserItem addItemToUser(User user, ItemEntity item) {
        UserItem userItem = UserItem.builder()
                .userId(user.getId())
                .item(item)
                .build();
        return userItemRepository.save(userItem);
    }

    public ResponseEntity<List<UserItemDTO>> getUserItems(@Nonnull HttpServletRequest request) {
        User user = (User) request.getAttribute("currentUser");
        List<UserItem> userItems = userItemRepository.findByUserId(user.getId());

        List<UserItemDTO> response = userItems.stream()
                .map(userItem -> UserItemDTO.builder()
                        .id(userItem.getId())
                        .userId(userItem.getUserId())
                        .itemName(userItem.getItem().getName())
                        .image(userItem.getItem().getImage().getImageData())
                        .createdAt(userItem.getCreatedAt())
                        .price(userItem.getItem().getPrice())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

}
