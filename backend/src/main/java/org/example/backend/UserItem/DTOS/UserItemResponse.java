package org.example.backend.UserItem.DTOS;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserItemResponse {
    private Long userItemId;
    private String itemId;
}