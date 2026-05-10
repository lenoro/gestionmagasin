package com.gestionmagasin.controller;

import com.gestionmagasin.model.Facture;
import com.gestionmagasin.model.Item;
import com.gestionmagasin.repository.FactureRepository;
import com.gestionmagasin.repository.ItemRepository;
import com.gestionmagasin.service.StockService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/factures")
public class FactureController {

    private final FactureRepository factureRepo;
    private final ItemRepository itemRepo;
    private final StockService stockService;

    public FactureController(FactureRepository factureRepo, ItemRepository itemRepo, StockService stockService) {
        this.factureRepo  = factureRepo;
        this.itemRepo     = itemRepo;
        this.stockService = stockService;
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

    @GetMapping("/search")
    public List<Facture> search(
            @RequestParam(required = false) Integer clientId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return factureRepo.findAll().stream()
                .filter(f -> clientId == null || (f.getClient() != null && f.getClient().getId() == clientId))
                .filter(f -> from == null || f.getInvoiceDate() == null || !f.getInvoiceDate().isBefore(from))
                .filter(f -> to   == null || f.getInvoiceDate() == null || !f.getInvoiceDate().isAfter(to))
                .toList();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Facture facture) {
        Facture saved = factureRepo.save(facture);
        try {
            stockService.enregistrerSorties(saved);
        } catch (RuntimeException e) {
            factureRepo.deleteById(saved.getId());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
        return ResponseEntity.ok(saved);
    }

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
