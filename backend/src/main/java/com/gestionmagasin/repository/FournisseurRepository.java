package com.gestionmagasin.repository;

import com.gestionmagasin.model.Fournisseur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FournisseurRepository extends JpaRepository<Fournisseur, Long> {
    List<Fournisseur> findByActifTrue();
}
