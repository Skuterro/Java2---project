package org.example.backend.item.mapper;

import org.example.backend.item.model.Item;
import org.example.backend.item.model.ItemEntity;
import org.mapstruct.Mapper;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Mapper(componentModel = "spring")
public interface ItemMapperJpa {
    ItemEntity toEntity(Item item);
    Item toItem(ItemEntity itemEntity);
    List<Item> toItemList(Page<ItemEntity> itemEntities);
}
