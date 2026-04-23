package com.gestionmagasin.controller;

import com.gestionmagasin.model.Vehicule;
import com.gestionmagasin.repository.VehiculeRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vehicules")
@CrossOrigin(origins = "*")
public class VehiculeController {

    private final VehiculeRepository repo;

    public VehiculeController(VehiculeRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Vehicule> findAll() { return repo.findAll(); }

    @GetMapping("/{id}")
    public Vehicule findById(@PathVariable Long id) {
        return repo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Véhicule introuvable : " + id));
    }

    @PostMapping
    public Vehicule create(@RequestBody Vehicule vehicule) { return repo.save(vehicule); }

    @PutMapping("/{id}")
    public Vehicule update(@PathVariable Long id, @RequestBody Vehicule vehicule) {
        vehicule.setId(id);
        return repo.save(vehicule);
    }
}
