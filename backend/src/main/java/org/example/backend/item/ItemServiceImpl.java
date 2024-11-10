package org.example.backend.item;

import lombok.RequiredArgsConstructor;
import org.example.backend.commons.ValidationMessageConst;
import org.springframework.stereotype.Service;

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
