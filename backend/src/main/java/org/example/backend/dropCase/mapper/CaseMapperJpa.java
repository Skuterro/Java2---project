package org.example.backend.dropCase.mapper;

import org.example.backend.dropCase.model.Case;

import org.example.backend.dropCase.model.CaseEntity;
import org.mapstruct.Mapper;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Mapper(componentModel = "spring")
public interface CaseMapperJpa {
    Case toCase(CaseEntity caseEntity);
    List<Case> toCaseList(Page<CaseEntity> caseEntities);
}
