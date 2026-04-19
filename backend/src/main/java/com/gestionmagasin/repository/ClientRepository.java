package com.gestionmagasin.repository;

import com.gestionmagasin.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ClientRepository extends JpaRepository<Client, Long> {
    Client findByClientCode(String clientCode);
    List<Client> findByClientNameContainingIgnoreCase(String name);
}