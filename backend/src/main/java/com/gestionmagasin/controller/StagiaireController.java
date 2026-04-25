package com.gestionmagasin.controller;

import com.gestionmagasin.model.Stagiaire;
import com.gestionmagasin.repository.StagiaireRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stagiaires")
@CrossOrigin(origins = "*")
public class StagiaireController {

    private final StagiaireRepository repo;

    public StagiaireController(StagiaireRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Stagiaire> getAll() { return repo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Stagiaire> getById(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Stagiaire create(@RequestBody Stagiaire s) { return repo.save(s); }

    @PutMapping("/{id}")
    public ResponseEntity<Stagiaire> update(@PathVariable Long id, @RequestBody Stagiaire data) {
        return repo.findById(id).map(s -> {
            s.setNumInscription(data.getNumInscription());
            s.setNomPrenom(data.getNomPrenom());
            s.setGroupeSection(data.getGroupeSection());
            s.setDateDebutFormation(data.getDateDebutFormation());
            s.setDateFinFormation(data.getDateFinFormation());
            s.setKitRemis(data.getKitRemis());
            s.setDateRemiseTrousseau(data.getDateRemiseTrousseau());
            s.setCautionVersee(data.getCautionVersee());
            s.setEtatRetour(data.getEtatRetour());
            s.setObservations(data.getObservations());
            return ResponseEntity.ok(repo.save(s));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
