package com.gestionmagasin.repository;

import com.gestionmagasin.model.Famille;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FamilleRepository extends JpaRepository<Famille, Long> {
}
