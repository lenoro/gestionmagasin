package com.gestionmagasin.controller;

import com.gestionmagasin.model.Retour;
import com.gestionmagasin.model.RetourItem;
import com.gestionmagasin.repository.RetourRepository;
import com.gestionmagasin.service.StockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/retours")
public class RetourController {

    private final RetourRepository retourRepo;
    private final StockService stockService;

    public RetourController(RetourRepository retourRepo, StockService stockService) {
        this.retourRepo   = retourRepo;
        this.stockService = stockService;
    }

    @GetMapping
    public List<Retour> getAll() {
        return retourRepo.findAllByOrderByDateRetourDesc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Retour> getById(@PathVariable int id) {
        return retourRepo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/facture/{factureId}")
    public List<Retour> getByFacture(@PathVariable int factureId) {
        return retourRepo.findByFactureId(factureId);
    }

    @PostMapping
    public Retour create(@RequestBody Retour retour) {
        if (retour.getStatut() == null) retour.setStatut("EN_ATTENTE");
        // lier les items au retour parent
        if (retour.getItems() != null) {
            for (RetourItem ri : retour.getItems()) {
                ri.setRetour(retour);
            }
        }
        return retourRepo.save(retour);
    }

    // Accepter = passer en ACCEPTE et incrémenter le stock
    @PostMapping("/{id}/accepter")
    public ResponseEntity<?> accepter(@PathVariable int id) {
        try {
            Retour retour = stockService.accepterRetour(id);
            return ResponseEntity.ok(retour);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Refuser le retour
    @PostMapping("/{id}/refuser")
    public ResponseEntity<?> refuser(@PathVariable int id) {
        return retourRepo.findById(id).map(r -> {
            r.setStatut("REFUSE");
            return ResponseEntity.ok(retourRepo.save(r));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        if (!retourRepo.existsById(id)) return ResponseEntity.notFound().build();
        retourRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
