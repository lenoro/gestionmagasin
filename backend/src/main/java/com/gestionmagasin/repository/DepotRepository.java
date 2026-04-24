package com.gestionmagasin.repository;

import com.gestionmagasin.model.Depot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DepotRepository extends JpaRepository<Depot, Long> {
    List<Depot> findByActifTrue();
}
