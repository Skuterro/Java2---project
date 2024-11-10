package org.example.backend.item;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@RequiredArgsConstructor
@Repository
public class ItemRepositoryImpl implements ItemRepository {

    private final ItemRepositoryJpa itemRepositoryJpa;

    private final ItemMapperJpa itemMapperJpa;

    @Override
    public Item addItem(Item item) {
        return itemMapperJpa.toItem(itemRepositoryJpa.save(itemMapperJpa.toEntity(item)));
    }

    @Override
    public Item getById(String id) {
        return itemMapperJpa.toItem(itemRepositoryJpa.findById(id).get());
    }

    @Override
    public boolean existsById(String id) {
        return itemRepositoryJpa.existsById(id);
    }

}
