package org.example.backend.caseItemProb.repository;

import jakarta.transaction.Transactional;
import org.example.backend.caseItemProb.model.CaseItemChance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Transactional
@Repository
public interface CaseItemChanceRepository extends JpaRepository<CaseItemChance, Long> {

    List<CaseItemChance> findByCaseEntity_Id(String caseId);

}