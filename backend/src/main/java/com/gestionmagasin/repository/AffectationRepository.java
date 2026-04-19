package com.gestionmagasin.repository;

import com.gestionmagasin.model.Affectation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AffectationRepository extends JpaRepository<Affectation, Long> {
    boolean existsByCode(String code);
}
