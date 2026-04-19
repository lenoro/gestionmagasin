package com.gestionmagasin.repository;

import com.gestionmagasin.model.Ouvrage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface OuvrageRepository extends JpaRepository<Ouvrage, Long> {

    @Query("SELECT MAX(o.numeroOuvrage) FROM Ouvrage o WHERE o.numeroOuvrage LIKE :prefix%")
    Optional<String> findMaxNumeroByPrefix(String prefix);
}
