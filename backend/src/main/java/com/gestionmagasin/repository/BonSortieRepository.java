package com.gestionmagasin.repository;

import com.gestionmagasin.model.BonSortie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface BonSortieRepository extends JpaRepository<BonSortie, Long> {

    @Query("SELECT MAX(b.numeroBon) FROM BonSortie b WHERE b.numeroBon LIKE :prefix%")
    Optional<String> findMaxNumeroByPrefix(String prefix);
}
