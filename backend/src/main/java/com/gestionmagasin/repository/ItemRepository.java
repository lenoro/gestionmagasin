package com.gestionmagasin.repository;

import com.gestionmagasin.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Integer> {
    List<Item> findByInvoiceId(int invoiceId);
}
