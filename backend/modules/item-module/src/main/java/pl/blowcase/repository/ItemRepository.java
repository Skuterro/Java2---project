package pl.blowcase.repository;

import pl.blowcase.model.Item;

public interface ItemRepository {
    Item addItem(Item item);
    Item getById(String id);
    boolean existsById(String id);
}
