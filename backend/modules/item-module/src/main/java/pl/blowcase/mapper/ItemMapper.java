package pl.blowcase.mapper;

import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;
import pl.blowcase.model.Item;
import pl.blowcase.model.ItemSaveForm;

@Component
@Mapper(componentModel = "spring")
public interface ItemMapper {
    Item toItem(ItemSaveForm form);
}
