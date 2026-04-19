package com.gestionmagasin.controller;

import com.gestionmagasin.model.Produit;
import com.gestionmagasin.repository.ProduitRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/producteurs")
@CrossOrigin(origins = "*")
public class ProduitController {

    private final ProduitRepository repo;

    public ProduitController(ProduitRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Produit> getAll() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produit> getById(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Produit create(@RequestBody Produit produit) {
        return repo.save(produit);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produit> update(@PathVariable Long id, @RequestBody Produit data) {
        return repo.findById(id).map(p -> {
            p.setProducerCode(data.getProducerCode());
            p.setProducerName(data.getProducerName());
            p.setContactEmail(data.getContactEmail());
            p.setPhone(data.getPhone());
            return ResponseEntity.ok(repo.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
