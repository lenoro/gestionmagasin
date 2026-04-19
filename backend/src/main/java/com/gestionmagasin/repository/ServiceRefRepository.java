package com.gestionmagasin.repository;

import com.gestionmagasin.model.ServiceRef;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceRefRepository extends JpaRepository<ServiceRef, Long> {
    boolean existsByLibelle(String libelle);
}
