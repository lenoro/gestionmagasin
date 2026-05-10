package com.gestionmagasin.config;

import com.gestionmagasin.model.Etablissement;
import com.gestionmagasin.model.Utilisateur;
import com.gestionmagasin.repository.EtablissementRepository;
import com.gestionmagasin.repository.UtilisateurRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final EtablissementRepository etablissementRepo;
    private final UtilisateurRepository utilisateurRepo;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(EtablissementRepository etablissementRepo,
                           UtilisateurRepository utilisateurRepo,
                           PasswordEncoder passwordEncoder) {
        this.etablissementRepo = etablissementRepo;
        this.utilisateurRepo = utilisateurRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
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

        if (utilisateurRepo.count() == 0) {
            Utilisateur admin = Utilisateur.builder()
                .username("admin")
                .password(passwordEncoder.encode("123"))
                .role("ROLE_ADMIN")
                .build();
            utilisateurRepo.save(admin);
            System.out.println("✅ Utilisateur admin créé.");
        }
    }
}
