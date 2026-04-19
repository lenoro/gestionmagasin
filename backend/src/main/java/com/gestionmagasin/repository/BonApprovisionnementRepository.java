package com.gestionmagasin.repository;

import com.gestionmagasin.model.BonApprovisionnement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface BonApprovisionnementRepository extends JpaRepository<BonApprovisionnement, Long> {

    @Query("SELECT MAX(b.numeroBon) FROM BonApprovisionnement b WHERE b.numeroBon LIKE :prefix%")
    Optional<String> findMaxNumeroByPrefix(String prefix);
}
