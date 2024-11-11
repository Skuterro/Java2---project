package org.example.backend.dropCase.repository;

import org.example.backend.dropCase.model.CaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CaseRepositoryJpa extends JpaRepository<CaseEntity, String> {
}
