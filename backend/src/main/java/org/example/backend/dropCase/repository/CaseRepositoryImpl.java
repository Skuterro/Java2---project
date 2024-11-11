package org.example.backend.dropCase.repository;

import lombok.RequiredArgsConstructor;
import org.example.backend.dropCase.mapper.CaseMapperJpa;
import org.example.backend.dropCase.model.Case;
import org.example.backend.dropCase.model.CaseEntity;
import org.example.backend.dropCase.model.CaseSaveForm;
import org.example.backend.item.model.ItemEntity;
import org.example.backend.item.repository.ItemRepositoryJpa;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;
import java.util.List;

@RequiredArgsConstructor
@Repository
public class CaseRepositoryImpl implements CaseRepsitory{

    private final ItemRepositoryJpa itemRepositoryJpa;

    private final CaseRepositoryJpa caseRepositoryJpa;

    private final CaseMapperJpa caseMapperJpa;

    @Override
    public Case addCase(CaseSaveForm form) {
        CaseEntity createdCase = CaseEntity.builder()
                .name(form.name())
                .price(0.0)
                .items(mapItems(form.itemsIds()))
                .build();
        return caseMapperJpa.toCase(caseRepositoryJpa.save(createdCase));
    }

    @Override
    public List<Case> getAllCases(Pageable pageable) {
        return caseMapperJpa.toCaseList(caseRepositoryJpa.findAll(pageable));
    }

    private List<ItemEntity> mapItems(List<String>itemsIds){
        return itemsIds.stream()
                .map(id -> itemRepositoryJpa.findById(id).orElse(null))
                .toList();
    }
}
