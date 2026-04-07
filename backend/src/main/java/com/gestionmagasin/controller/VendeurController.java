package com.gestionmagasin.controller;

import com.gestionmagasin.model.Vendeur;
import com.gestionmagasin.repository.VendeurRepository;
import com.gestionmagasin.service.TraceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vendeurs")
public class VendeurController {

    private final VendeurRepository repo;
    private final TraceService      traceService;

    public VendeurController(VendeurRepository repo, TraceService traceService) {
        this.repo         = repo;
        this.traceService = traceService;
    }

    @GetMapping
    public List<Vendeur> getAll() { return repo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Vendeur> getById(@PathVariable Integer id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<Vendeur> getByCode(@PathVariable String code) {
        Vendeur v = repo.findByVendorCode(code);
        return v != null ? ResponseEntity.ok(v) : ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    public List<Vendeur> search(@RequestParam String name) {
        return repo.findByVendorNameContainingIgnoreCase(name);
    }

    @PostMapping
    public Vendeur create(@RequestBody Vendeur vendeur) {
        Vendeur saved = repo.save(vendeur);
        traceService.log("VENDEUR", "AJOUT",
                saved.getVendorCode(),
                null,
                saved.getVendorName() + " | Tél: " + saved.getPhone(),
                "Création vendeur");
        return saved;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vendeur> update(@PathVariable Integer id, @RequestBody Vendeur data) {
        return repo.findById(id).map(v -> {
            String ancienne = v.getVendorName() + " | Email: " + v.getContactEmail();
            v.setVendorCode(data.getVendorCode());
            v.setVendorName(data.getVendorName());
            v.setContactEmail(data.getContactEmail());
            v.setPhone(data.getPhone());
            Vendeur saved = repo.save(v);
            String nouvelle = saved.getVendorName() + " | Email: " + saved.getContactEmail();
            traceService.log("VENDEUR", "MODIFICATION",
                    saved.getVendorCode(), ancienne, nouvelle, "Modification vendeur");
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        return repo.findById(id).map(v -> {
            traceService.log("VENDEUR", "SUPPRESSION",
                    v.getVendorCode(),
                    v.getVendorName() + " | Tél: " + v.getPhone(),
                    null,
                    "Suppression vendeur");
            repo.deleteById(id);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
