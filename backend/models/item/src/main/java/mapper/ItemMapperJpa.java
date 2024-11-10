package mapper;

import model.Item;
import model.ItemEntity;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface ItemMapperJpa {
    ItemEntity toEntity(Item item);
    Item toItem(ItemEntity itemEntity);
}
