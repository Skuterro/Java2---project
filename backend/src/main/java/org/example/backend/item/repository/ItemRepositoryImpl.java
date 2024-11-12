package org.example.backend.item.repository;

import lombok.RequiredArgsConstructor;
import org.example.backend.item.mapper.ItemMapperJpa;
import org.example.backend.item.model.Item;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

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
    public List<Item> getAllItems(Pageable pageable) {
        return itemMapperJpa.toItemList(itemRepositoryJpa.findAll(pageable));
    }

    @Override
    public boolean existsById(String id) {
        return itemRepositoryJpa.existsById(id);
    }
}
