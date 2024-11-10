package org.example.backend.item;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepositoryJpa extends JpaRepository<ItemEntity, String> {
}
