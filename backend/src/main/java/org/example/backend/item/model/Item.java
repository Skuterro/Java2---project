package org.example.backend.item.model;

import lombok.Builder;

@Builder(toBuilder = true)
public record Item(
        String id,
        String name,
        String rarity,
        Double price,
        byte[] imageData
) {
}
