package com.gestionmagasin.repository;

import com.gestionmagasin.model.BonEntree;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface BonEntreeRepository extends JpaRepository<BonEntree, Long> {

    @Query("SELECT MAX(b.numeroBon) FROM BonEntree b WHERE b.numeroBon LIKE :prefix%")
    Optional<String> findMaxNumeroByPrefix(String prefix);
}
