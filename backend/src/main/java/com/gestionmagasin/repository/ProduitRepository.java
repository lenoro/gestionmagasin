package com.gestionmagasin.repository;

import com.gestionmagasin.model.Produit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProduitRepository extends JpaRepository<Produit, Long> {
    Produit findByProducerCode(String producerCode);
}
