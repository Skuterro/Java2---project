package org.example.backend.dropCase.mapper;

import org.example.backend.dropCase.model.Case;

import org.example.backend.dropCase.model.CaseEntity;
import org.example.backend.item.model.ItemEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@Mapper(componentModel = "spring")
public interface CaseMapperJpa {
    @Mapping(target = "itemsIds", source = "items", qualifiedByName = "mapItemIds")
    @Mapping(target = "imageData", source = "image.imageData")
    Case toCase(CaseEntity caseEntity);

    @Named("mapItemIds")
    default List<String> mapItemIds(List<ItemEntity> items) {
        if (items == null) {
            return List.of();
        }
        return items.stream()
                .map(ItemEntity::getId)
                .collect(Collectors.toList());
    }

    default List<Case> toCaseList(Page<CaseEntity> caseEntities) {
        return caseEntities.stream()
                .map(this::toCase)
                .collect(Collectors.toList());
    }

    default Page<Case> toCasePage(Page<CaseEntity> caseEntityPage) {
        if (caseEntityPage == null) {
            return Page.empty();
        }
        return caseEntityPage.map(this::toCase);
    }
}
