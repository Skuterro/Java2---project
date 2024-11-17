package org.example.backend.item.repository;

import org.example.backend.item.model.Item;
import org.example.backend.item.model.ItemSaveForm;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ItemRepository {
    Item addItem(ItemSaveForm form);
    Item getById(String id);
    List<Item> getAllItems(Pageable pageable);
    boolean existsById(String id);
}
