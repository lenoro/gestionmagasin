package com.gestionmagasin.repository;

import com.gestionmagasin.model.BienInventaire;
import com.gestionmagasin.model.StatutBien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BienInventaireRepository extends JpaRepository<BienInventaire, Long> {

    @Query("SELECT MAX(b.numeroInventaire) FROM BienInventaire b WHERE b.numeroInventaire LIKE :prefix%")
    Optional<String> findMaxNumeroByPrefix(String prefix);

    List<BienInventaire> findByStatut(StatutBien statut);
}
