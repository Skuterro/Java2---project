package org.example.backend.item;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/items")
//TODO ogarnąć corsy
//@CrossOrigin(origins = "http://localhost:...")
public class ItemController {

    private final ItemService itemService;

    @PostMapping
    public Item addItem(@RequestBody ItemSaveForm form){
        return itemService.addItem(form);
    }

    @GetMapping("/{id}")
    public Item getById(@PathVariable String id){
        return itemService.getById(id);
    }
}
