package org.example.backend.item.repository;

import org.example.backend.item.model.ItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemRepositoryJpa extends JpaRepository<ItemEntity, String> {
}
