package com.gestionmagasin.controller;

import com.gestionmagasin.model.Approvisionnement;
import com.gestionmagasin.model.ApprovisionnementItem;
import com.gestionmagasin.repository.ApprovisionnementRepository;
import com.gestionmagasin.service.StockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/approvisionnements")
public class ApprovisionnementController {

    private final ApprovisionnementRepository approRepo;
    private final StockService stockService;

    public ApprovisionnementController(ApprovisionnementRepository approRepo, StockService stockService) {
        this.approRepo    = approRepo;
        this.stockService = stockService;
    }

    @GetMapping
    public List<Approvisionnement> getAll() {
        return approRepo.findAllByOrderByDateApproDesc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Approvisionnement> getById(@PathVariable int id) {
        return approRepo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Approvisionnement create(@RequestBody Approvisionnement appro) {
        if (appro.getStatut() == null) appro.setStatut("EN_ATTENTE");
        // lier les items à l'appro parent
        if (appro.getItems() != null) {
            for (ApprovisionnementItem ai : appro.getItems()) {
                ai.setApprovisionnement(appro);
            }
        }
        return approRepo.save(appro);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Approvisionnement> update(@PathVariable int id, @RequestBody Approvisionnement data) {
        return approRepo.findById(id).map(a -> {
            a.setProducteur(data.getProducteur());
            a.setDateAppro(data.getDateAppro());
            a.setReference(data.getReference());
            a.setNotes(data.getNotes());
            return ResponseEntity.ok(approRepo.save(a));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Valider = passer en RECU et incrémenter le stock
    @PostMapping("/{id}/valider")
    public ResponseEntity<?> valider(@PathVariable int id) {
        try {
            Approvisionnement appro = stockService.validerAppro(id);
            return ResponseEntity.ok(appro);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        if (!approRepo.existsById(id)) return ResponseEntity.notFound().build();
        approRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
