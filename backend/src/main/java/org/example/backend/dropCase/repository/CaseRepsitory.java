package org.example.backend.dropCase.repository;

import org.example.backend.dropCase.model.Case;

import org.example.backend.dropCase.model.CaseSaveForm;
import org.example.backend.item.model.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CaseRepsitory {
    Case addCase(CaseSaveForm form, Double casePrice);
    List<Case> getAllCases(Pageable pageable);
    Case getCaseById(String id);
    Page<Case> getAllCasesPage(Pageable pageable);

    @Query("SELECT c.items FROM CaseEntity c WHERE c.id = :caseId")
    List<Item> findItemsByCaseId(@Param("caseId") String caseId);
}
