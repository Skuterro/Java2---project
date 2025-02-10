package org.example.backend.dropCase.controller;

import jakarta.annotation.Nonnull;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.backend.UserItem.DTOS.UserItemResponse;
import org.example.backend.dropCase.model.Case;
import org.example.backend.dropCase.model.CaseSaveForm;
import org.example.backend.dropCase.service.CaseService;
import org.example.backend.item.model.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<String> addCase(@RequestBody CaseSaveForm form){
        return caseService.addCase(form);
    }

    @GetMapping
    public Page<Case> getAllCases(Pageable pageable){
        return caseService.getAllCases(pageable);
    }

    @GetMapping("/search")
    public Page<Case> searchProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return caseService.getAllCases(pageable);
    }

    @GetMapping("/{id}")
    public Case getCaseById(@PathVariable String id){ return caseService.getCaseById(id); }

    @GetMapping("/{id}/items")
    public List<Item> getCaseItemsByCaseId(@PathVariable String id){
        return caseService.getCaseItemsByCaseId(id);
    }

    @GetMapping("/open/{id}")
    public UserItemResponse OpenCaseById(@PathVariable String id,
                                         @Nonnull HttpServletRequest request){
        return caseService.openCase(id, request);
    }
}
