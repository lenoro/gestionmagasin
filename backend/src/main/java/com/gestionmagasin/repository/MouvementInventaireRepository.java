package com.gestionmagasin.repository;

import com.gestionmagasin.model.MouvementInventaire;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MouvementInventaireRepository extends JpaRepository<MouvementInventaire, Long> {
    List<MouvementInventaire> findByBienIdOrderByDateOperationDesc(Long bienId);
}
