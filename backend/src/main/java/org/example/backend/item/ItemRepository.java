package org.example.backend.item;

public interface ItemRepository {
    Item addItem(Item item);
    Item getById(String id);
    boolean existsById(String id);
}
