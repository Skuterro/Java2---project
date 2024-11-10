package org.example.backend.item;

import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface ItemMapper {
    Item toItem(ItemSaveForm form);
}
