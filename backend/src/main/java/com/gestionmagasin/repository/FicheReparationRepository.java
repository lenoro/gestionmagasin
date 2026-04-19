package com.gestionmagasin.repository;

import com.gestionmagasin.model.FicheReparation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface FicheReparationRepository extends JpaRepository<FicheReparation, Long> {

    @Query("SELECT MAX(f.numeroFiche) FROM FicheReparation f WHERE f.numeroFiche LIKE :prefix%")
    Optional<String> findMaxNumeroByPrefix(String prefix);
}
