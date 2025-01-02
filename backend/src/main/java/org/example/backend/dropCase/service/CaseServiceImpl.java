package org.example.backend.dropCase.service;

import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.example.backend.caseItemProb.model.CaseItemChance;
import org.example.backend.caseItemProb.repository.CaseItemChanceRepository;
import org.example.backend.caseItemProb.service.CaseItemChanceService;
import org.example.backend.dropCase.mapper.CaseMapper;
import org.example.backend.dropCase.model.Case;
import org.example.backend.dropCase.model.CaseSaveForm;

import org.example.backend.dropCase.repository.CaseRepsitory;
import org.example.backend.item.model.Item;
import org.example.backend.item.repository.ItemRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class CaseServiceImpl implements CaseService{

    private final CaseRepsitory caseRepsitory;
    private final ItemRepository itemRepository;
    private final CaseMapper caseMapper;
    private final CaseItemChanceService caseItemChanceService;
    private final CaseItemChanceRepository caseItemChanceRepository;

    @Override
    public ResponseEntity<String> addCase(CaseSaveForm form) {
        if(form.itemProb().size() != form.itemsIds().size()){
            throw new IndexOutOfBoundsException("Items ids must match size with items probabilities.");
        }

        Double casePrice = 0d;
        Float allItemProb = 0f;
        for(int i=0; i<form.itemProb().size(); i++){
            Item item = itemRepository.getById(form.itemsIds().get(i));
            if(item == null){
                throw new InternalError("Wrong item id");
            }

            allItemProb += form.itemProb().get(i);
            casePrice += form.itemProb().get(i) * item.price();
        }

        if(allItemProb != 1){
            throw new IndexOutOfBoundsException("Items probabilities must match size with items probabilities.");
        }

        Case blowCase = caseRepsitory.addCase(form, casePrice);

        if(blowCase == null){
            throw new InternalError("Case not added.");
        }

        String caseId = blowCase.id();

        for(int i = 0; i < form.itemProb().size(); i++){
            String itemId = form.itemsIds().get(i);
            Float itemProb = form.itemProb().get(i);
            caseItemChanceService.saveCaseItemChance(caseId, itemId, itemProb);
        }

        return ResponseEntity.status(HttpStatus.OK).body("Success");
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

    @Override
    public Item openCase(String caseId){
        List<CaseItemChance> itemProbs = caseItemChanceRepository.findByCaseEntity_Id(caseId);

        Random random = new Random();
        float randomValue = random.nextFloat();
        float cumulativeProbability = 0.0f;

        for(int i=0; i<itemProbs.size(); i++){
            cumulativeProbability += itemProbs.get(i).getChance();
            if(randomValue < cumulativeProbability){
                return itemRepository.getById(itemProbs.get(i).getItemEntity().getId());
            }
        }

        throw new InternalError("Case not opened.");
    }
}
