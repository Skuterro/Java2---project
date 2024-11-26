package org.example.backend.item.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.backend.dropCase.model.CaseEntity;
import org.example.backend.image.model.Image;

import java.util.Set;

@Data
@Entity
@Table(name = "items")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String rarity;

    @Column(nullable = false)
    private Double price;

    @ManyToMany(mappedBy = "items")
    Set<CaseEntity> cases;

    @ManyToOne
    @JoinColumn(name = "imageId")
    private Image image;
}
