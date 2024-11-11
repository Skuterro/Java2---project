package org.example.backend.item.repository;

import org.example.backend.item.model.Item;

public interface ItemRepository {
    Item addItem(Item item);
    Item getById(String id);
    boolean existsById(String id);
}
