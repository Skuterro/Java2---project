package org.example.backend.image.repository;

import jakarta.transaction.Transactional;
import org.example.backend.image.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

@Transactional
public interface ImageRepository extends JpaRepository<Image, Long> {

    Image findByImageId(String id);

    Image findByName(String name);
}
