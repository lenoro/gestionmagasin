package com.gestionmagasin.controller;

import com.gestionmagasin.model.Affectation;
import com.gestionmagasin.repository.AffectationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/affectations")
@CrossOrigin(origins = "*")
public class AffectationController {

    private final AffectationRepository repo;

    public AffectationController(AffectationRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Affectation> findAll() {
        return repo.findAll();
    }

    @PostMapping
    public ResponseEntity<Affectation> create(@RequestBody Affectation affectation) {
        if (repo.existsByCode(affectation.getCode())) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(repo.save(affectation));
    }
}
