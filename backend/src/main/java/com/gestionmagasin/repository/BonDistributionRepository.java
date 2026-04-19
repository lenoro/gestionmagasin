package com.gestionmagasin.repository;

import com.gestionmagasin.model.BonDistribution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface BonDistributionRepository extends JpaRepository<BonDistribution, Long> {

    @Query("SELECT MAX(b.numeroBon) FROM BonDistribution b WHERE b.numeroBon LIKE :prefix%")
    Optional<String> findMaxNumeroByPrefix(String prefix);
}
