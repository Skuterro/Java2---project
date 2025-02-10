package org.example.backend.dropCase.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backend.UserItem.DTOS.UserItemResponse;
import org.example.backend.UserItem.model.UserItem;
import org.example.backend.UserItem.service.UserItemService;
import org.example.backend.caseItemProb.model.CaseItemChance;
import org.example.backend.caseItemProb.repository.CaseItemChanceRepository;
import org.example.backend.caseItemProb.service.CaseItemChanceService;
import org.example.backend.dropCase.model.Case;
import org.example.backend.dropCase.model.CaseSaveForm;

import org.example.backend.dropCase.repository.CaseRepositoryJpa;
import org.example.backend.dropCase.repository.CaseRepsitory;
import org.example.backend.item.model.Item;
import org.example.backend.item.repository.ItemRepository;
import org.example.backend.user.User;
import org.example.backend.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Transactional
public class CaseServiceImpl implements CaseService{

    private final CaseRepsitory caseRepsitory;
    private final ItemRepository itemRepository;
    private final CaseItemChanceService caseItemChanceService;
    private final CaseItemChanceRepository caseItemChanceRepository;
    private final UserRepository userRepository;
    private final UserItemService userItemService;


    @Override
    public Page<Case> getAllCases(Pageable pageable) {
        return caseRepsitory.getAllCasesPage(pageable);
    }

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

        if(Math.round(allItemProb * 100.0) / 100.0 != 1){
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
    public Case getCaseById(String id) {return caseRepsitory.getCaseById(id);}

    @Override
    public List<Item> getCaseItemsByCaseId(String caseId){
        return caseRepsitory.findItemsByCaseId(caseId);
    }

    @Override
    @Transactional
    public UserItemResponse openCase(String caseId, HttpServletRequest request){
        User user =  (User) request.getAttribute("currentUser");
        Case blowCase = caseRepsitory.getCaseById(caseId);

        if(user.getBalance() < blowCase.price()){
            throw new IllegalArgumentException("No money");
        }

        user.setBalance((float) (user.getBalance() - blowCase.price()));
        userRepository.save(user);

        List<CaseItemChance> itemProbs = caseItemChanceRepository.findByCaseEntity_Id(caseId);

        Random random = new Random();
        float randomValue = random.nextFloat();
        float cumulativeProbability = 0.0f;

        for(int i=0; i<itemProbs.size(); i++){
            cumulativeProbability += itemProbs.get(i).getChance();
            if(randomValue < cumulativeProbability){
                UserItem userItem = userItemService.addItemToUser(user, itemProbs.get(i).getItemEntity());
                return UserItemResponse.builder().userItemId(userItem.getId()).itemId(userItem.getItem().getId()).build();

            }
        }

        throw new InternalError("Case not opened.");
    }
}
