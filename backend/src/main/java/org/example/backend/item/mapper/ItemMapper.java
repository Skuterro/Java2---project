package org.example.backend.item.mapper;

import org.example.backend.item.model.Item;
import org.example.backend.item.model.ItemSaveForm;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface ItemMapper {
    Item toItem(ItemSaveForm form);
}
