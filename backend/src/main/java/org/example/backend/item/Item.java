package org.example.backend.item;

import lombok.Builder;

@Builder(toBuilder = true)
public record Item(
        String id,
        String name,
        Integer price
) {
}
