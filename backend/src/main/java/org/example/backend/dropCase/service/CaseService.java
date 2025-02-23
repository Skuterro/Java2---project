package org.example.backend.dropCase.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.example.backend.UserItem.DTOS.UserItemResponse;
import org.example.backend.dropCase.model.Case;
import org.example.backend.dropCase.model.CaseSaveForm;

import org.example.backend.item.model.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.http.ResponseEntity;

import java.util.List;

public interface CaseService {
    ResponseEntity<String> addCase(@Valid CaseSaveForm form);
    Page<Case> getAllCases(Pageable pageable);
    Case getCaseById(String id);
    List<Item> getCaseItemsByCaseId(String caseId);
    UserItemResponse openCase(String caseId, HttpServletRequest request);
}
