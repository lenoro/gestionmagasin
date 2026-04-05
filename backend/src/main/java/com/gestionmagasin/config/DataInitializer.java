package com.gestionmagasin.config;

import com.gestionmagasin.model.Etablissement;
import com.gestionmagasin.repository.EtablissementRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final EtablissementRepository etablissementRepo;

    public DataInitializer(EtablissementRepository etablissementRepo) {
        this.etablissementRepo = etablissementRepo;
    }

    @Override
    public void run(String... args) {
        // Insérer l'établissement uniquement si la table est vide
        if (etablissementRepo.count() == 0) {
            Etablissement e = new Etablissement();
            e.setRep("République Algérienne Démocratique et Populaire");
            e.setMinistere("Ministère de la Formation et de l'Enseignement Professionnels");
            e.setWilaya("Direction de la Formation Professionnelle de la Wilaya de Constantine");
            e.setCentre("CFPA  Zighoud Youcef");
            e.setResponsable("Zaetoche Khoder");
            etablissementRepo.save(e);
            System.out.println("✅ Établissement initialisé.");
        }
    }
}
