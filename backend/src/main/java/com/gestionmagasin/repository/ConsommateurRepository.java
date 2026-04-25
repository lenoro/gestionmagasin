package com.gestionmagasin.repository;

import com.gestionmagasin.model.Consommateur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ConsommateurRepository extends JpaRepository<Consommateur, Long> {
    List<Consommateur> findByActifTrue();
}
