package pl.blowcase.mapper;

import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;
import pl.blowcase.model.Item;
import pl.blowcase.model.ItemEntity;

@Component
@Mapper(componentModel = "spring")
public interface ItemMapperJpa {
    ItemEntity toEntity(Item item);
    Item toItem(ItemEntity itemEntity);
}
