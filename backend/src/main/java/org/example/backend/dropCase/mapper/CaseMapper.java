package org.example.backend.dropCase.mapper;

import org.example.backend.dropCase.model.Case;
import org.example.backend.dropCase.model.CaseSaveForm;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface CaseMapper {
    Case toCase(CaseSaveForm form);
}
