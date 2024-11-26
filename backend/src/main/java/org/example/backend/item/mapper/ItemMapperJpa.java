package org.example.backend.item.mapper;

import org.example.backend.item.model.Item;
import org.example.backend.item.model.ItemEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Mapper(componentModel = "spring")
public interface ItemMapperJpa {
    @Mapping(target = "imageData", source = "image.imageData")

    Item toItem(ItemEntity itemEntity);
    List<Item> toItemList(Page<ItemEntity> itemEntities);
}
