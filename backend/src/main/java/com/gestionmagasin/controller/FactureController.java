package com.gestionmagasin.controller;

import com.gestionmagasin.model.Facture;
import com.gestionmagasin.model.Item;
import com.gestionmagasin.repository.FactureRepository;
import com.gestionmagasin.repository.ItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/factures")
public class FactureController {

    private final FactureRepository factureRepo;
    private final ItemRepository itemRepo;

    public FactureController(FactureRepository factureRepo, ItemRepository itemRepo) {
        this.factureRepo = factureRepo;
        this.itemRepo    = itemRepo;
    }

    @GetMapping
    public List<Facture> getAll() { return factureRepo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Facture> getById(@PathVariable Integer id) {
        return factureRepo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/client/{clientId}")
    public List<Facture> getByClient(@PathVariable int clientId) {
        return factureRepo.findByClientId(clientId);
    }

    @GetMapping("/number/{number}")
    public ResponseEntity<Facture> getByNumber(@PathVariable String number) {
        return factureRepo.findByInvoiceNumber(number)
                .map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/items")
    public List<Item> getItems(@PathVariable int id) {
        return itemRepo.findByInvoiceId(id);
    }

    @PostMapping
    public Facture create(@RequestBody Facture facture) { return factureRepo.save(facture); }

    @PutMapping("/{id}")
    public ResponseEntity<Facture> update(@PathVariable Integer id, @RequestBody Facture data) {
        return factureRepo.findById(id).map(f -> {
            f.setInvoiceNumber(data.getInvoiceNumber());
            f.setInvoiceDate(data.getInvoiceDate());
            f.setClient(data.getClient());
            f.setVendeur(data.getVendeur());
            f.setTotalAmount(data.getTotalAmount());
            f.setStatus(data.getStatus());
            return ResponseEntity.ok(factureRepo.save(f));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!factureRepo.existsById(id)) return ResponseEntity.notFound().build();
        factureRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
