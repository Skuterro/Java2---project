package org.example.backend.dropCase.repository;

import org.example.backend.dropCase.model.Case;

import org.example.backend.dropCase.model.CaseSaveForm;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface CaseRepsitory {
    Case addCase(CaseSaveForm form);
    List<Case> getAllCases(Pageable pageable);
    Case getCaseById(String id);
    boolean existsById(String id);
}
