package com.gestionmagasin.controller;

import com.gestionmagasin.model.Facture;
import com.gestionmagasin.model.Item;
import com.gestionmagasin.repository.FactureRepository;
import com.gestionmagasin.repository.ItemRepository;
import com.gestionmagasin.service.StockService;
import com.gestionmagasin.service.TraceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/factures")
public class FactureController {

    private final FactureRepository factureRepo;
    private final ItemRepository    itemRepo;
    private final StockService      stockService;
    private final TraceService      traceService;

    public FactureController(FactureRepository factureRepo, ItemRepository itemRepo,
                             StockService stockService, TraceService traceService) {
        this.factureRepo  = factureRepo;
        this.itemRepo     = itemRepo;
        this.stockService = stockService;
        this.traceService = traceService;
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
    public Facture create(@RequestBody Facture facture) {
        Facture saved = factureRepo.save(facture);
        try { stockService.enregistrerSorties(saved); } catch (Exception ignored) {}
        traceService.log("FACTURE", "AJOUT",
                saved.getInvoiceNumber(),
                null,
                "Client: " + (saved.getClient() != null ? saved.getClient().getClientName() : "?")
                        + " | Total: " + saved.getTotalAmount(),
                "Création facture");
        return saved;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Facture> update(@PathVariable Integer id, @RequestBody Facture data) {
        return factureRepo.findById(id).map(f -> {
            String ancienne = "N°" + f.getInvoiceNumber() + " | Statut: " + f.getStatus()
                    + " | Total: " + f.getTotalAmount();
            f.setInvoiceNumber(data.getInvoiceNumber());
            f.setInvoiceDate(data.getInvoiceDate());
            f.setClient(data.getClient());
            f.setVendeur(data.getVendeur());
            f.setTotalAmount(data.getTotalAmount());
            f.setStatus(data.getStatus());
            Facture saved = factureRepo.save(f);
            String nouvelle = "N°" + saved.getInvoiceNumber() + " | Statut: " + saved.getStatus()
                    + " | Total: " + saved.getTotalAmount();
            traceService.log("FACTURE", "MODIFICATION",
                    saved.getInvoiceNumber(), ancienne, nouvelle, "Modification facture");
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        return factureRepo.findById(id).map(f -> {
            traceService.log("FACTURE", "SUPPRESSION",
                    f.getInvoiceNumber(),
                    "Client: " + (f.getClient() != null ? f.getClient().getClientName() : "?")
                            + " | Total: " + f.getTotalAmount(),
                    null,
                    "Suppression facture");
            factureRepo.deleteById(id);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
