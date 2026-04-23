package com.gestionmagasin.controller;

import com.gestionmagasin.model.Employe;
import com.gestionmagasin.repository.EmployeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employes")
@CrossOrigin(origins = "*")
public class EmployeController {

    private final EmployeRepository repo;

    public EmployeController(EmployeRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Employe> findAll() {
        return repo.findAll();
    }

    @GetMapping("/actifs")
    public List<Employe> findActifs() {
        return repo.findByActifTrue();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employe> findById(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Employe> create(@RequestBody Employe employe) {
        return ResponseEntity.ok(repo.save(employe));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employe> update(@PathVariable Long id, @RequestBody Employe data) {
        return repo.findById(id).map(e -> {
            e.setMatricule(data.getMatricule());
            e.setNom(data.getNom());
            e.setPrenom(data.getPrenom());
            e.setGrade(data.getGrade());
            e.setFonction(data.getFonction());
            e.setService(data.getService());
            e.setTelephone(data.getTelephone());
            e.setEmail(data.getEmail());
            e.setActif(data.getActif());
            return ResponseEntity.ok(repo.save(e));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
