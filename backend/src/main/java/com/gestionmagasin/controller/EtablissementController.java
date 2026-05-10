package com.gestionmagasin.controller;

import com.gestionmagasin.model.Etablissement;
import com.gestionmagasin.repository.EtablissementRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/etablissement")
public class EtablissementController {

    private final EtablissementRepository repo;

    public EtablissementController(EtablissementRepository repo) {
        this.repo = repo;
    }

    // Lire l'enregistrement unique
    @GetMapping
    public ResponseEntity<Etablissement> get() {
        return repo.findAll().stream().findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    // Créer l'enregistrement (seulement si vide)
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Etablissement data) {
        if (repo.count() > 0) {
            return ResponseEntity.badRequest().body("Un enregistrement existe déjà. Utilisez PUT pour modifier.");
        }
        return ResponseEntity.ok(repo.save(data));
    }

    // Mettre à jour l'enregistrement unique
    @PutMapping
    public ResponseEntity<?> update(@RequestBody Etablissement data) {
        return repo.findAll().stream().findFirst().map(e -> {
            e.setRep(data.getRep());
            e.setMinistere(data.getMinistere());
            e.setWilaya(data.getWilaya());
            e.setCentre(data.getCentre());
            e.setResponsable(data.getResponsable());
            return ResponseEntity.ok(repo.save(e));
        }).orElse(ResponseEntity.notFound().build());
    }
}
