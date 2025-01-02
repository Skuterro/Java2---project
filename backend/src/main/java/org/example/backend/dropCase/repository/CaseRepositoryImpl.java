package org.example.backend.dropCase.repository;

import lombok.RequiredArgsConstructor;
import org.example.backend.dropCase.mapper.CaseMapperJpa;
import org.example.backend.dropCase.model.Case;
import org.example.backend.dropCase.model.CaseEntity;
import org.example.backend.dropCase.model.CaseSaveForm;
import org.example.backend.image.model.Image;
import org.example.backend.image.repository.ImageRepository;
import org.example.backend.item.mapper.ItemMapperJpa;
import org.example.backend.item.model.Item;
import org.example.backend.item.model.ItemEntity;
import org.example.backend.item.repository.ItemRepositoryJpa;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;
import java.util.List;

@RequiredArgsConstructor
@Repository
public class CaseRepositoryImpl implements CaseRepsitory{

    private final ItemRepositoryJpa itemRepositoryJpa;

    private final CaseRepositoryJpa caseRepositoryJpa;

    private final CaseMapperJpa caseMapperJpa;

    private final ImageRepository imageRepositoryJpa;
    private final ItemMapperJpa itemMapperJpa;

    @Override
    public Case addCase(CaseSaveForm form, Double casePrice) {

        Image image = imageRepositoryJpa.findByImageId(form.imageId()).orElse(null);

        CaseEntity createdCase = CaseEntity.builder()
                .name(form.name())
                .price(casePrice)
                .items(mapItems(form.itemsIds()))
                .image(image)
                .build();
        return caseMapperJpa.toCase(caseRepositoryJpa.save(createdCase));
    }

    @Override
    public List<Case> getAllCases(Pageable pageable) {
        return caseMapperJpa.toCaseList(caseRepositoryJpa.findAll(pageable));
    }

    @Override
    public Case getCaseById(String id) {
        return caseMapperJpa.toCase(caseRepositoryJpa.findById(id).orElse(null));
    }

    private List<ItemEntity> mapItems(List<String>itemsIds){
        return itemsIds.stream()
                .map(id -> itemRepositoryJpa.findById(id).orElse(null))
                .toList();
    }

    @Override
    public List<Item> findItemsByCaseId(String caseId) {
        CaseEntity caseEntity = caseRepositoryJpa.findById(caseId).orElse(null);

        if (caseEntity == null) {
            throw new IllegalArgumentException("Case with ID " + caseId + " not found");
        }

        return caseEntity.getItems().stream()
                .map(itemMapperJpa::toItem)
                .toList();
    }
}
