package com.gestionmagasin.repository;

import com.gestionmagasin.model.Fonction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FonctionRepository extends JpaRepository<Fonction, Long> {
    boolean existsByLibelle(String libelle);
}
