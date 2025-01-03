package org.example.backend.item.repository;

import lombok.RequiredArgsConstructor;
import org.example.backend.image.model.Image;
import org.example.backend.image.repository.ImageRepository;
import org.example.backend.item.mapper.ItemMapperJpa;
import org.example.backend.item.model.Item;
import org.example.backend.item.model.ItemEntity;
import org.example.backend.item.model.ItemSaveForm;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@RequiredArgsConstructor
@Repository
public class ItemRepositoryImpl implements ItemRepository {

    private final ItemRepositoryJpa itemRepositoryJpa;

    private final ItemMapperJpa itemMapperJpa;

    private final ImageRepository imageRepositoryJpa;

    @Override
    public Item addItem(ItemSaveForm form) {
        Image image = imageRepositoryJpa.findByImageId(form.imageId()).orElse(null);

        ItemEntity createdItem = ItemEntity.builder()
                .name(form.name())
                .price(form.price())
                .image(image)
                .rarity(form.rarity())
                .build();
        return itemMapperJpa.toItem(itemRepositoryJpa.save(createdItem));
    }

    @Override
    public ItemEntity findById(String itemId) {
        return itemRepositoryJpa.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Nie znaleziono przedmiotu o ID: " + itemId));
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