package com.gestionmagasin.repository;

import com.gestionmagasin.model.Vendeur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VendeurRepository extends JpaRepository<Vendeur, Integer> {
    Vendeur findByVendorCode(String vendorCode);
    List<Vendeur> findByVendorNameContainingIgnoreCase(String name);
}