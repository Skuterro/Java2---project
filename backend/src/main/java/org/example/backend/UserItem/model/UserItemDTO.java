package org.example.backend.UserItem.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserItemDTO {
    private Long id;
    private int userId;
    private String itemName; // Assuming ItemEntity has a `name` field
    private LocalDateTime createdAt;
    private byte[] image;
    private double price;
}