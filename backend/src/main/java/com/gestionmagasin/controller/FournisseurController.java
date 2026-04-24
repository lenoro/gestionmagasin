package com.gestionmagasin.controller;

import com.gestionmagasin.model.Fournisseur;
import com.gestionmagasin.repository.FournisseurRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/fournisseurs")
@CrossOrigin(origins = "*")
public class FournisseurController {

    private final FournisseurRepository repo;

    public FournisseurController(FournisseurRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Fournisseur> findAll() { return repo.findAll(); }

    @GetMapping("/actifs")
    public List<Fournisseur> findActifs() { return repo.findByActifTrue(); }

    @GetMapping("/{id}")
    public ResponseEntity<Fournisseur> findById(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Fournisseur> create(@RequestBody Fournisseur f) {
        return ResponseEntity.ok(repo.save(f));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fournisseur> update(@PathVariable Long id, @RequestBody Fournisseur data) {
        return repo.findById(id).map(f -> {
            f.setCode(data.getCode());
            f.setRaisonSociale(data.getRaisonSociale());
            f.setAdresse(data.getAdresse());
            f.setVille(data.getVille());
            f.setTelephone(data.getTelephone());
            f.setEmail(data.getEmail());
            f.setNif(data.getNif());
            f.setRc(data.getRc());
            f.setContactNom(data.getContactNom());
            f.setDelaiPaiementJours(data.getDelaiPaiementJours());
            f.setActif(data.getActif());
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
