package service;

import lombok.RequiredArgsConstructor;
import model.Item;
import model.ItemSaveForm;
import mapper.ItemMapper;
import repository.ItemRepository;
import org.springframework.stereotype.Service;
import validation.ValidationMessageConst;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;

    private final ItemMapper itemMapper;

    @Override
    public Item addItem(ItemSaveForm form) {
        return itemRepository.addItem(itemMapper.toItem(form));
    }

    @Override
    public Item getById(String id) {
        if(!itemRepository.existsById(id)){
            throw new RuntimeException(ValidationMessageConst.NO_ITEM);
        }

        return itemRepository.getById(id);
    }
}
