package com.gestionmagasin.controller;

import com.gestionmagasin.model.Client;
import com.gestionmagasin.repository.ClientRepository;
import com.gestionmagasin.service.TraceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clients")
public class ClientController {

    private final ClientRepository repo;
    private final TraceService     traceService;

    public ClientController(ClientRepository repo, TraceService traceService) {
        this.repo         = repo;
        this.traceService = traceService;
    }

    @GetMapping
    public List<Client> getAll() { return repo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Client> getById(@PathVariable Integer id) {
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
        Client saved = repo.save(client);
        traceService.log("CLIENT", "AJOUT",
                saved.getClientCode(),
                null,
                saved.getClientName() + " | Tél: " + saved.getPhone(),
                "Création client");
        return saved;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Client> update(@PathVariable Integer id, @RequestBody Client data) {
        return repo.findById(id).map(c -> {
            String ancienne = c.getClientName() + " | Email: " + c.getEmail() + " | Tél: " + c.getPhone();
            c.setClientCode(data.getClientCode());
            c.setClientName(data.getClientName());
            c.setEmail(data.getEmail());
            c.setPhone(data.getPhone());
            c.setAddress(data.getAddress());
            Client saved = repo.save(c);
            String nouvelle = saved.getClientName() + " | Email: " + saved.getEmail() + " | Tél: " + saved.getPhone();
            traceService.log("CLIENT", "MODIFICATION",
                    saved.getClientCode(), ancienne, nouvelle, "Modification client");
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        return repo.findById(id).map(c -> {
            traceService.log("CLIENT", "SUPPRESSION",
                    c.getClientCode(),
                    c.getClientName() + " | Tél: " + c.getPhone(),
                    null,
                    "Suppression client");
            repo.deleteById(id);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
