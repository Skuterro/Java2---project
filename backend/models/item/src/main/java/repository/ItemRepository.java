package repository;

import model.Item;

public interface ItemRepository {
    Item addItem(Item item);
    Item getById(String id);
    boolean existsById(String id);
}
