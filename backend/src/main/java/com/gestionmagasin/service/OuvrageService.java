package com.gestionmagasin.service;

import com.gestionmagasin.model.Ouvrage;
import com.gestionmagasin.repository.OuvrageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class OuvrageService {

    private final OuvrageRepository repo;

    public OuvrageService(OuvrageRepository repo) {
        this.repo = repo;
    }

    public String genererNumeroOuvrage() {
        int annee = LocalDate.now().getYear();
        String prefix = "LIV-" + annee + "-";
        Optional<String> max = repo.findMaxNumeroByPrefix(prefix);
        int seq = max.map(s -> Integer.parseInt(s.substring(prefix.length())) + 1).orElse(1);
        return String.format("%s%04d", prefix, seq);
    }

    public Ouvrage creer(Ouvrage ouvrage) {
        ouvrage.setNumeroOuvrage(genererNumeroOuvrage());
        ouvrage.setCreatedAt(LocalDate.now());
        if (ouvrage.getNbreExemplaires() == null || ouvrage.getNbreExemplaires() < 1) {
            ouvrage.setNbreExemplaires(1);
        }
        return repo.save(ouvrage);
    }

    public Ouvrage modifier(Long id, Ouvrage maj) {
        Ouvrage existant = repo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Ouvrage introuvable : " + id));
        existant.setTitre(maj.getTitre());
        existant.setAuteur(maj.getAuteur());
        existant.setIsbn(maj.getIsbn());
        existant.setEditeur(maj.getEditeur());
        existant.setDomaine(maj.getDomaine());
        existant.setAnneePublication(maj.getAnneePublication());
        existant.setLocalisation(maj.getLocalisation());
        if (maj.getNbreExemplaires() != null && maj.getNbreExemplaires() >= 1) {
            existant.setNbreExemplaires(maj.getNbreExemplaires());
        }
        return repo.save(existant);
    }

    public List<Ouvrage> findAll() {
        return repo.findAll();
    }

    public Ouvrage findById(Long id) {
        return repo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Ouvrage introuvable : " + id));
    }
}
