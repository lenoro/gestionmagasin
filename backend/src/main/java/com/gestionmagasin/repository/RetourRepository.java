package com.gestionmagasin.repository;

import com.gestionmagasin.model.Retour;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RetourRepository extends JpaRepository<Retour, Integer> {
    List<Retour> findByStatutOrderByDateRetourDesc(String statut);
    List<Retour> findAllByOrderByDateRetourDesc();
    List<Retour> findByFactureId(int factureId);
}
