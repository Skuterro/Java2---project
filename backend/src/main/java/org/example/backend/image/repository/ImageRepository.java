package org.example.backend.image.repository;

import jakarta.transaction.Transactional;
import org.example.backend.image.model.ImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

@Transactional
public interface ImageRepository extends JpaRepository<ImageEntity, Long> {

    Optional<ImageEntity> findByImageId(String id);
}
