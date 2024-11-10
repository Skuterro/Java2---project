package service;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import model.Item;
import model.ItemSaveForm;

public interface ItemService {
    Item addItem(@Valid ItemSaveForm itemSaveForm);
    Item getById(@NotBlank String id);;
}
