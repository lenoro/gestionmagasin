package com.gestionmagasin.controller;

import com.gestionmagasin.model.Client;
import com.gestionmagasin.repository.ClientRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/clients")
@CrossOrigin(origins = "*")
public class ClientController {

    private final ClientRepository repo;

    public ClientController(ClientRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Client> getAll() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Client> getById(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<Client> getByCode(@PathVariable String code) {
        Client c = repo.findByClientCode(code);
        return c != null ? ResponseEntity.ok(c) : ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    public List<Client> search(@RequestParam String name) {
        return repo.findByClientNameContainingIgnoreCase(name);
    }

    @PostMapping
    public Client create(@RequestBody Client client) {
        if (client.getClientCode() == null || client.getClientCode().isBlank()) {
            client.setClientCode(String.format("CLI-%04d", repo.count() + 1));
        }
        return repo.save(client);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Client> update(@PathVariable Long id, @RequestBody Client data) {
        return repo.findById(id).map(c -> {
            c.setClientCode(data.getClientCode());
            c.setClientName(data.getClientName());
            c.setEmail(data.getEmail());
            c.setPhone(data.getPhone());
            c.setAddress(data.getAddress());
            return ResponseEntity.ok(repo.save(c));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
