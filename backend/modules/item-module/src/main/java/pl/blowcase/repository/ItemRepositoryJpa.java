package pl.blowcase.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.blowcase.model.ItemEntity;

public interface ItemRepositoryJpa extends JpaRepository<ItemEntity, String> {
}
