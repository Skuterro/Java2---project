package repository;

import model.ItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepositoryJpa extends JpaRepository<ItemEntity, String> {
}
