package org.example.backend;

import org.example.backend.UserItem.model.UserItem;
import org.example.backend.UserItem.model.UserItemDTO;
import org.example.backend.UserItem.repository.UserItemRepository;
import org.example.backend.UserItem.service.UserItemService;
import org.example.backend.item.model.ItemEntity;
import org.example.backend.user.User;
import org.example.backend.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import jakarta.servlet.http.HttpServletRequest;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserItemServiceTest {

    @Mock
    private UserItemRepository userItemRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserItemService userItemService;

    @Mock
    private HttpServletRequest request;

    private User mockUser;

    @BeforeEach
    void setUp() {
        // Przykładowy użytkownik
        mockUser = new User();
        mockUser.setId(1);
        mockUser.setBalance(100.0f);

        // Gdy wywołamy request.getAttribute("currentUser"), zwróć mockUser
        when(request.getAttribute("currentUser")).thenReturn(mockUser);
    }

    @Test
    void testSellUserItem_Success() {
        // Przygotowanie danych
        long itemId = 10L;
        ItemEntity mockItemEntity = new ItemEntity();
        mockItemEntity.setPrice(50.0);

        UserItem mockUserItem = UserItem.builder()
                .id(itemId)
                .item(mockItemEntity)
                .userId(mockUser.getId())
                .build();

        // Zasymuluj znalezienie UserItem w repo
        when(userItemRepository.findById(itemId)).thenReturn(Optional.of(mockUserItem));

        // Wywołanie metody
        ResponseEntity<String> response = userItemService.sellUserItem(itemId, request);

        // Weryfikacja
        assertEquals("Success", response.getBody());
        verify(userRepository).save(mockUser);
        verify(userItemRepository).deleteById(itemId);

        // Sprawdzamy czy balans użytkownika się zaktualizował: 100 + 50 = 150
        assertEquals(150.0f, mockUser.getBalance());
    }

    @Test
    void testSellUserItem_ItemNotFound() {
        long itemId = 99L;
        when(userItemRepository.findById(itemId)).thenReturn(Optional.empty());

        // Oczekujemy, że w metodzie wyleci np. RuntimeException
        assertThrows(RuntimeException.class, () -> {
            userItemService.sellUserItem(itemId, request);
        });

        // Nie powinien zapisywać usera
        verify(userRepository, never()).save(any());
        // Nie powinien usuwać itemu
        verify(userItemRepository, never()).deleteById(anyLong());
    }

    @Test
    void testAddItemToUser() {
        // Dane
        ItemEntity mockItem = new ItemEntity();
        mockItem.setId("asd");
        mockItem.setPrice(123.0);

        // Oczekiwany zapisany obiekt
        UserItem savedUserItem = UserItem.builder()
                .id(42L)
                .item(mockItem)
                .userId(mockUser.getId())
                .build();

        when(userItemRepository.save(any(UserItem.class))).thenReturn(savedUserItem);

        // Wywołanie
        UserItem result = userItemService.addItemToUser(mockUser, mockItem);

        // Weryfikacja
        assertNotNull(result);
        assertEquals(42L, result.getId());
        assertEquals("asd", result.getItem().getId());
        verify(userItemRepository).save(any(UserItem.class));
    }

    @Test
    void testGetUserItems() {
        // Przygotowanie listy
        ItemEntity item1 = new ItemEntity();
        item1.setPrice(10.0);
        item1.setName("Item1");

        UserItem ui1 = UserItem.builder()
                .id(1L)
                .userId(mockUser.getId())
                .item(item1)
                .build();

        ItemEntity item2 = new ItemEntity();
        item2.setPrice(20.0);
        item2.setName("Item2");

        UserItem ui2 = UserItem.builder()
                .id(2L)
                .userId(mockUser.getId())
                .item(item2)
                .build();

        List<UserItem> userItems = Arrays.asList(ui1, ui2);

        when(userItemRepository.findByUserId(mockUser.getId())).thenReturn(userItems);

        // Wywołanie
        ResponseEntity<List<UserItemDTO>> response = userItemService.getUserItems(
                request,
                "createdAt",
                "desc"
        );
        // Weryfikacja
        assertNotNull(response);
        assertEquals(2, response.getBody().size());
        assertEquals("Item1", response.getBody().get(0).getItemName());
        assertEquals("Item2", response.getBody().get(1).getItemName());

        verify(userItemRepository).findByUserId(mockUser.getId());
    }
}
