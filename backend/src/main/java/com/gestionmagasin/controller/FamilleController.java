package com.gestionmagasin.controller;

import com.gestionmagasin.model.Famille;
import com.gestionmagasin.repository.FamilleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/familles")
@CrossOrigin(origins = "*")
public class FamilleController {

    private final FamilleRepository repo;

    public FamilleController(FamilleRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Famille> findAll() { return repo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Famille> findById(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Famille> create(@RequestBody Famille f) {
        return ResponseEntity.ok(repo.save(f));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Famille> update(@PathVariable Long id, @RequestBody Famille data) {
        return repo.findById(id).map(f -> {
            f.setCode(data.getCode());
            f.setLibelle(data.getLibelle());
            f.setDescription(data.getDescription());
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
