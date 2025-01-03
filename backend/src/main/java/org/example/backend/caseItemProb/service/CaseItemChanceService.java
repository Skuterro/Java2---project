package org.example.backend.caseItemProb.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backend.caseItemProb.model.CaseItemChance;
import org.example.backend.caseItemProb.repository.CaseItemChanceRepository;
import org.example.backend.dropCase.model.CaseEntity;
import org.example.backend.dropCase.repository.CaseRepositoryJpa;
import org.example.backend.item.model.ItemEntity;
import org.example.backend.item.repository.ItemRepositoryJpa;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional

public class CaseItemChanceService {

    private final CaseItemChanceRepository caseItemChanceRepository;
    private final CaseRepositoryJpa caseRepository;
    private final ItemRepositoryJpa itemRepository;

    public CaseItemChance saveCaseItemChance(String caseId, String itemId, Float chance) {
        CaseEntity caseEntity = caseRepository.findById(caseId)
                .orElseThrow(() -> new EntityNotFoundException("Case not found with id: " + caseId));

        ItemEntity itemEntity = itemRepository.findById(itemId)
                .orElseThrow(() -> new EntityNotFoundException("Item not found with id: " + itemId));

        CaseItemChance caseItemChance = CaseItemChance.builder()
                .caseEntity(caseEntity)
                .itemEntity(itemEntity)
                .chance(chance)
                .build();

        return caseItemChanceRepository.save(caseItemChance);
    }

    public List<CaseItemChance> getCaseItemChancesForCase(String caseId) {
        return caseItemChanceRepository.findByCaseEntity_Id(caseId);
    }
}
