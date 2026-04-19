package com.gestionmagasin.repository;

import com.gestionmagasin.model.Facture;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FactureRepository extends JpaRepository<Facture, Long> {
    List<Facture> findByClientId(Long clientId);
    Optional<Facture> findByInvoiceNumber(String invoiceNumber);
}
