package com.gestionmagasin.repository;

import com.gestionmagasin.model.Approvisionnement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApprovisionnementRepository extends JpaRepository<Approvisionnement, Integer> {
    List<Approvisionnement> findByStatutOrderByDateApproDesc(String statut);
    List<Approvisionnement> findAllByOrderByDateApproDesc();
}
