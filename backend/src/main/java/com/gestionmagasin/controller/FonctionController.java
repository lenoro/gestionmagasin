package com.gestionmagasin.controller;

import com.gestionmagasin.model.Fonction;
import com.gestionmagasin.repository.FonctionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fonctions")
@CrossOrigin(origins = "*")
public class FonctionController {

    private final FonctionRepository repo;

    public FonctionController(FonctionRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Fonction> findAll() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fonction> findById(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Fonction> create(@RequestBody Fonction fonction) {
        return ResponseEntity.ok(repo.save(fonction));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fonction> update(@PathVariable Long id, @RequestBody Fonction data) {
        return repo.findById(id).map(f -> {
            f.setLibelle(data.getLibelle());
            return ResponseEntity.ok(repo.save(f));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
