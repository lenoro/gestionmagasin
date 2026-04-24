package com.gestionmagasin.config;

import com.gestionmagasin.model.Utilisateur;
import com.gestionmagasin.repository.UtilisateurRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UtilisateurRepository repo;

    public DataInitializer(UtilisateurRepository repo) {
        this.repo = repo;
    }

    @Override
    public void run(String... args) {
        if (repo.count() == 0) {
            Utilisateur admin = new Utilisateur();
            admin.setUsername("admin");
            admin.setPassword("123");
            admin.setRole("ROLE_ADMIN");
            repo.save(admin);
        }
    }
}
