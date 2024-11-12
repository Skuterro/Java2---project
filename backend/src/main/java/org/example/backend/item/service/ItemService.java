package org.example.backend.item.service;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.example.backend.item.model.Item;
import org.example.backend.item.model.ItemSaveForm;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ItemService {
    Item addItem(@Valid ItemSaveForm itemSaveForm);
    Item getById(@NotBlank String id);
    List<Item> getAllItems(Pageable pageable);
}
