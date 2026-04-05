package com.gestionmagasin.repository;

import com.gestionmagasin.model.Etablissement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EtablissementRepository extends JpaRepository<Etablissement, Integer> {
}
