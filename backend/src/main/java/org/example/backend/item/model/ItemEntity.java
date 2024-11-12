package org.example.backend.item.model;

import jakarta.persistence.*;
import lombok.Data;
import org.example.backend.dropCase.model.CaseEntity;

import java.util.Set;

@Data
@Entity
@Table(name = "items")
public class ItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double price;

    @ManyToMany(mappedBy = "items")
    Set<CaseEntity> cases;
}
