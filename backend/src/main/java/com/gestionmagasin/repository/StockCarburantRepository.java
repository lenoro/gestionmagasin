package com.gestionmagasin.repository;

import com.gestionmagasin.model.StockCarburant;
import com.gestionmagasin.model.TypeCarburant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StockCarburantRepository extends JpaRepository<StockCarburant, Long> {
    Optional<StockCarburant> findByTypeCarburant(TypeCarburant typeCarburant);
}
