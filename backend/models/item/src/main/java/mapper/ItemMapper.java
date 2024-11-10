package mapper;

import model.Item;
import model.ItemSaveForm;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface ItemMapper {
    Item toItem(ItemSaveForm form);
}
