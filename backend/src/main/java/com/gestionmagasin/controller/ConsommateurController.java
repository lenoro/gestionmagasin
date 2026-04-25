package com.gestionmagasin.controller;

import com.gestionmagasin.model.Consommateur;
import com.gestionmagasin.repository.ConsommateurRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/consommateurs")
@CrossOrigin(origins = "*")
public class ConsommateurController {

    private final ConsommateurRepository repo;

    public ConsommateurController(ConsommateurRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Consommateur> getAll() { return repo.findByActifTrue(); }

    @GetMapping("/{id}")
    public ResponseEntity<Consommateur> getById(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Consommateur create(@RequestBody Consommateur c) {
        c.setActif(true);
        return repo.save(c);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Consommateur> update(@PathVariable Long id, @RequestBody Consommateur data) {
        return repo.findById(id).map(c -> {
            c.setNomPrenom(data.getNomPrenom());
            c.setServiceAtelier(data.getServiceAtelier());
            c.setTypeConsommateur(data.getTypeConsommateur());
            c.setTelephone(data.getTelephone());
            return ResponseEntity.ok(repo.save(c));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return repo.findById(id).map(c -> {
            c.setActif(false);
            repo.save(c);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
