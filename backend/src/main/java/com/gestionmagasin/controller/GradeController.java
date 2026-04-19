package com.gestionmagasin.controller;

import com.gestionmagasin.model.Grade;
import com.gestionmagasin.repository.GradeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grades")
@CrossOrigin(origins = "*")
public class GradeController {

    private final GradeRepository repo;

    public GradeController(GradeRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Grade> findAll() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Grade> findById(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Grade> create(@RequestBody Grade grade) {
        return ResponseEntity.ok(repo.save(grade));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Grade> update(@PathVariable Long id, @RequestBody Grade data) {
        return repo.findById(id).map(g -> {
            g.setLibelle(data.getLibelle());
            return ResponseEntity.ok(repo.save(g));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
