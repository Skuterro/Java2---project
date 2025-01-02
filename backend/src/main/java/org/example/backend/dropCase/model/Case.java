package org.example.backend.dropCase.model;

import lombok.Builder;

import java.util.List;

@Builder(toBuilder = true)
public record Case(
        String id,
        String name,
        Double price,
        List<String> itemsIds,
        List<Float> itemsProb,//DLA KAZDEGO ITEMU POD TYM SAMYM INDEXEM PRAWODPODOBIENSTWO NP. 0.5 CZYLI 50% na np. kose
        byte[] imageData
) {
}
