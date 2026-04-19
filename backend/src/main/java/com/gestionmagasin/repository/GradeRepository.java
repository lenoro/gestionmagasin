package com.gestionmagasin.repository;

import com.gestionmagasin.model.Grade;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GradeRepository extends JpaRepository<Grade, Long> {
    boolean existsByLibelle(String libelle);
}
