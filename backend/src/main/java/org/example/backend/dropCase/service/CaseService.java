package org.example.backend.dropCase.service;

import jakarta.validation.Valid;
import org.example.backend.dropCase.model.Case;
import org.example.backend.dropCase.model.CaseSaveForm;

import org.springframework.data.domain.Pageable;
import java.util.List;

public interface CaseService {
    Case addCase(@Valid CaseSaveForm form);
    List<Case> getAllCases(Pageable pageable);
}
