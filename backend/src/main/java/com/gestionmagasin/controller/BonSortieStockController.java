package com.gestionmagasin.controller;

import com.gestionmagasin.model.BonSortieStock;
import com.gestionmagasin.model.LigneBonSortieStock;
import com.gestionmagasin.repository.BonSortieStockRepository;
import com.gestionmagasin.repository.DepotRepository;
import com.gestionmagasin.repository.EmployeRepository;
import com.gestionmagasin.repository.StockArticleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/stock-bons-sortie")
@CrossOrigin(origins = "*")
public class BonSortieStockController {

    private final BonSortieStockRepository repo;
    private final StockArticleRepository articleRepo;
    private final DepotRepository depotRepo;
    private final EmployeRepository employeRepo;

    public BonSortieStockController(BonSortieStockRepository repo, StockArticleRepository articleRepo,
                                    DepotRepository depotRepo, EmployeRepository employeRepo) {
        this.repo = repo;
        this.articleRepo = articleRepo;
        this.depotRepo = depotRepo;
        this.employeRepo = employeRepo;
    }

    @GetMapping
    public List<BonSortieStock> findAll() { return repo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<BonSortieStock> findById(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Transactional
    public ResponseEntity<BonSortieStock> create(@RequestBody BonSortieStock bon) {
        if (bon.getDepot() != null && bon.getDepot().getId() != null)
            bon.setDepot(depotRepo.findById(bon.getDepot().getId()).orElse(null));
        if (bon.getEmploye() != null && bon.getEmploye().getId() != null)
            bon.setEmploye(employeRepo.findById(bon.getEmploye().getId()).orElse(null));
        if (bon.getLignes() != null) {
            for (LigneBonSortieStock ligne : bon.getLignes()) {
                ligne.setBon(bon);
            }
        }
        BonSortieStock saved = repo.save(bon);
        if (saved.getNumero() == null || saved.getNumero().isBlank()) {
            int year = LocalDate.now().getYear();
            saved.setNumero(String.format("SOR-%d-%04d", year, saved.getId()));
            repo.save(saved);
        }
        return repo.findById(saved.getId()).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/valider")
    @Transactional
    public ResponseEntity<BonSortieStock> valider(@PathVariable Long id) {
        return repo.findById(id).map(bon -> {
            if ("BROUILLON".equals(bon.getStatut())) {
                bon.setStatut("VALIDÉ");
                if (bon.getLignes() != null) {
                    for (LigneBonSortieStock ligne : bon.getLignes()) {
                        if (ligne.getProduit() != null && ligne.getQuantiteDemandee() != null) {
                            articleRepo.findById(ligne.getProduit().getId()).ifPresent(a -> {
                                double qte = ligne.getQuantiteServie() != null ? ligne.getQuantiteServie() : ligne.getQuantiteDemandee();
                                a.setStockActuel((a.getStockActuel() == null ? 0.0 : a.getStockActuel()) - qte);
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
    public ResponseEntity<BonSortieStock> annuler(@PathVariable Long id) {
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
