package com.gestionmagasin.controller;

import com.gestionmagasin.model.Depot;
import com.gestionmagasin.repository.DepotRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/depots")
@CrossOrigin(origins = "*")
public class DepotController {

    private final DepotRepository repo;

    public DepotController(DepotRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Depot> findAll() { return repo.findAll(); }

    @GetMapping("/actifs")
    public List<Depot> findActifs() { return repo.findByActifTrue(); }

    @GetMapping("/{id}")
    public ResponseEntity<Depot> findById(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Depot> create(@RequestBody Depot d) {
        return ResponseEntity.ok(repo.save(d));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Depot> update(@PathVariable Long id, @RequestBody Depot data) {
        return repo.findById(id).map(d -> {
            d.setCode(data.getCode());
            d.setLibelle(data.getLibelle());
            d.setAdresse(data.getAdresse());
            d.setResponsable(data.getResponsable());
            d.setActif(data.getActif());
            return ResponseEntity.ok(repo.save(d));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
