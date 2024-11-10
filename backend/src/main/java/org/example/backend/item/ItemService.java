package org.example.backend.item;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

public interface ItemService {
    Item addItem(@Valid ItemSaveForm itemSaveForm);
    Item getById(@NotBlank String id);;
}
