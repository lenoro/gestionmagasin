package com.gestionmagasin.controller;

import com.gestionmagasin.model.ServiceRef;
import com.gestionmagasin.repository.ServiceRefRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/services-ref")
@CrossOrigin(origins = "*")
public class ServiceRefController {

    private final ServiceRefRepository repo;

    public ServiceRefController(ServiceRefRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<ServiceRef> findAll() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceRef> findById(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ServiceRef> create(@RequestBody ServiceRef serviceRef) {
        return ResponseEntity.ok(repo.save(serviceRef));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceRef> update(@PathVariable Long id, @RequestBody ServiceRef data) {
        return repo.findById(id).map(s -> {
            s.setLibelle(data.getLibelle());
            return ResponseEntity.ok(repo.save(s));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
