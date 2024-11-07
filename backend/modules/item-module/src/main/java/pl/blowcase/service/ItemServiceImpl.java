package pl.blowcase.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.blowcase.ValidationMessageConst;
import pl.blowcase.model.Item;
import pl.blowcase.mapper.ItemMapper;
import pl.blowcase.repository.ItemRepository;
import pl.blowcase.model.ItemSaveForm;

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
