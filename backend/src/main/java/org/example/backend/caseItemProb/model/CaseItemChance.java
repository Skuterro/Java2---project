package org.example.backend.caseItemProb.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.backend.dropCase.model.CaseEntity;
import org.example.backend.item.model.ItemEntity;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "case_item_chances")
public class CaseItemChance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "case_id", nullable = false)
    private CaseEntity caseEntity;

    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false)
    private ItemEntity itemEntity;

    @Column(nullable = false)
    private Float chance;
}