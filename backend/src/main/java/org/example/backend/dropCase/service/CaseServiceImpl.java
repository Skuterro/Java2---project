package org.example.backend.dropCase.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dropCase.mapper.CaseMapper;
import org.example.backend.dropCase.model.Case;
import org.example.backend.dropCase.model.CaseSaveForm;

import org.example.backend.dropCase.repository.CaseRepsitory;
import org.example.backend.item.model.Item;
import org.example.backend.item.repository.ItemRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CaseServiceImpl implements CaseService{

    private final CaseRepsitory caseRepsitory;
    private final ItemRepository itemRepository;
    private final CaseMapper caseMapper;

    @Override
    public Case addCase(CaseSaveForm form) {
        return caseRepsitory.addCase(form);
    }

    @Override
    public List<Case> getAllCases(Pageable pageable) {
        return caseRepsitory.getAllCases(pageable);
    }

    @Override
    public Case getCaseById(String id) {return caseRepsitory.getCaseById(id);}

    @Override
    public List<Item> getCaseItemsByCaseId(String caseId){
        return caseRepsitory.findItemsByCaseId(caseId);
    }
}
