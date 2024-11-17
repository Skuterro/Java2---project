package org.example.backend.dropCase.model;

import lombok.Builder;

import java.util.List;

@Builder(toBuilder = true)
public record Case(
        String id,
        String name,
        Double price,
        List<String> itemsIds,
        byte[] imageData
) {
}
