package org.example.backend.dropCase.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dropCase.model.Case;
import org.example.backend.dropCase.model.CaseSaveForm;
import org.example.backend.dropCase.service.CaseService;
import org.example.backend.item.model.Item;
import org.example.backend.item.service.ItemService;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/cases")
//TODO ogarnąć corsy
//@CrossOrigin(origins = "http://localhost:...")
public class CaseController {

    private final CaseService caseService;

    @PostMapping
    public Case addCase(@RequestBody CaseSaveForm form){
        return caseService.addCase(form);
    }

    @GetMapping
    public List<Case> getAllCases(Pageable pageable){
        return caseService.getAllCases(pageable);
    }

    @GetMapping("/{id}")
    public Case getCaseById(@PathVariable String id){ return caseService.getCaseById(id); }

    @GetMapping("/{id}/items")
    public List<Item> getCaseItemsByCaseId(@PathVariable String id){
        return caseService.getCaseItemsByCaseId(id);
    }
}
