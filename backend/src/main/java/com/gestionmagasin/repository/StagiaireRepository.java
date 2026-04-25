package com.gestionmagasin.repository;

import com.gestionmagasin.model.Stagiaire;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StagiaireRepository extends JpaRepository<Stagiaire, Long> {
    List<Stagiaire> findByNomPrenomContainingIgnoreCase(String nom);
    List<Stagiaire> findByGroupeSection(String groupeSection);
}
