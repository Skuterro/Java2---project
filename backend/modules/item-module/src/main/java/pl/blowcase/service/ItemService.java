package pl.blowcase.service;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import pl.blowcase.model.Item;
import pl.blowcase.model.ItemSaveForm;

public interface ItemService {
    Item addItem(@Valid ItemSaveForm itemSaveForm);
    Item getById(@NotBlank String id);;
}
