package com.gestionmagasin.repository;

import com.gestionmagasin.model.Vehicule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehiculeRepository extends JpaRepository<Vehicule, Long> {
}
