package com.gestionmagasin.controller;

import com.gestionmagasin.model.Unite;
import com.gestionmagasin.repository.UniteRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/unites")
@CrossOrigin(origins = "*")
public class UniteController {

    private final UniteRepository repo;

    public UniteController(UniteRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Unite> findAll() { return repo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Unite> findById(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Unite> create(@RequestBody Unite u) {
        return ResponseEntity.ok(repo.save(u));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Unite> update(@PathVariable Long id, @RequestBody Unite data) {
        return repo.findById(id).map(u -> {
            u.setCode(data.getCode());
            u.setLibelle(data.getLibelle());
            return ResponseEntity.ok(repo.save(u));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
