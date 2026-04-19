package com.gestionmagasin.controller;

import com.gestionmagasin.model.Vendeur;
import com.gestionmagasin.repository.VendeurRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/vendeurs")
@CrossOrigin(origins = "*")
public class VendeurController {

    private final VendeurRepository repo;

    public VendeurController(VendeurRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Vendeur> getAll() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vendeur> getById(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<Vendeur> getByCode(@PathVariable String code) {
        Vendeur v = repo.findByVendorCode(code);
        return v != null ? ResponseEntity.ok(v) : ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    public List<Vendeur> search(@RequestParam String name) {
        return repo.findByVendorNameContainingIgnoreCase(name);
    }

    @PostMapping
    public Vendeur create(@RequestBody Vendeur vendeur) {
        if (vendeur.getVendorCode() == null || vendeur.getVendorCode().isBlank()) {
            vendeur.setVendorCode(String.format("VEN-%04d", repo.count() + 1));
        }
        return repo.save(vendeur);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vendeur> update(@PathVariable Long id, @RequestBody Vendeur data) {
        return repo.findById(id).map(v -> {
            v.setVendorCode(data.getVendorCode());
            v.setVendorName(data.getVendorName());
            v.setContactEmail(data.getContactEmail());
            v.setPhone(data.getPhone());
            return ResponseEntity.ok(repo.save(v));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
