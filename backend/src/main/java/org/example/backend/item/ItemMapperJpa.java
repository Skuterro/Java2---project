package org.example.backend.item;

import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface ItemMapperJpa {
    ItemEntity toEntity(Item item);
    Item toItem(ItemEntity itemEntity);
}
