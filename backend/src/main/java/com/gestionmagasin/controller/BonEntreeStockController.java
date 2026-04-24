package com.gestionmagasin.controller;

import com.gestionmagasin.model.BonEntreeStock;
import com.gestionmagasin.model.LigneBonEntreeStock;
import com.gestionmagasin.repository.BonEntreeStockRepository;
import com.gestionmagasin.repository.DepotRepository;
import com.gestionmagasin.repository.FournisseurRepository;
import com.gestionmagasin.repository.StockArticleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/stock-bons-entree")
@CrossOrigin(origins = "*")
public class BonEntreeStockController {

    private final BonEntreeStockRepository repo;
    private final StockArticleRepository articleRepo;
    private final FournisseurRepository fournisseurRepo;
    private final DepotRepository depotRepo;

    public BonEntreeStockController(BonEntreeStockRepository repo, StockArticleRepository articleRepo,
                                    FournisseurRepository fournisseurRepo, DepotRepository depotRepo) {
        this.repo = repo;
        this.articleRepo = articleRepo;
        this.fournisseurRepo = fournisseurRepo;
        this.depotRepo = depotRepo;
    }

    @GetMapping
    public List<BonEntreeStock> findAll() { return repo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<BonEntreeStock> findById(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Transactional
    public ResponseEntity<BonEntreeStock> create(@RequestBody BonEntreeStock bon) {
        if (bon.getFournisseur() != null && bon.getFournisseur().getId() != null)
            bon.setFournisseur(fournisseurRepo.findById(bon.getFournisseur().getId()).orElse(null));
        if (bon.getDepot() != null && bon.getDepot().getId() != null)
            bon.setDepot(depotRepo.findById(bon.getDepot().getId()).orElse(null));
        if (bon.getLignes() != null) {
            for (LigneBonEntreeStock ligne : bon.getLignes()) {
                ligne.setBon(bon);
            }
        }
        BonEntreeStock saved = repo.save(bon);
        if (saved.getNumero() == null || saved.getNumero().isBlank()) {
            int year = LocalDate.now().getYear();
            saved.setNumero(String.format("REC-%d-%04d", year, saved.getId()));
            repo.save(saved);
        }
        return repo.findById(saved.getId()).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/valider")
    @Transactional
    public ResponseEntity<BonEntreeStock> valider(@PathVariable Long id) {
        return repo.findById(id).map(bon -> {
            if ("BROUILLON".equals(bon.getStatut())) {
                bon.setStatut("VALIDÉ");
                if (bon.getLignes() != null) {
                    for (LigneBonEntreeStock ligne : bon.getLignes()) {
                        if (ligne.getProduit() != null && ligne.getQuantite() != null) {
                            articleRepo.findById(ligne.getProduit().getId()).ifPresent(a -> {
                                a.setStockActuel((a.getStockActuel() == null ? 0.0 : a.getStockActuel()) + ligne.getQuantite());
                                articleRepo.save(a);
                            });
                        }
                    }
                }
            }
            return ResponseEntity.ok(repo.save(bon));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/annuler")
    @Transactional
    public ResponseEntity<BonEntreeStock> annuler(@PathVariable Long id) {
        return repo.findById(id).map(bon -> {
            bon.setStatut("ANNULÉ");
            return ResponseEntity.ok(repo.save(bon));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
