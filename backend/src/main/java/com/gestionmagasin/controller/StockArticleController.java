package com.gestionmagasin.controller;

import com.gestionmagasin.model.StockArticle;
import com.gestionmagasin.repository.StockArticleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/produits")
@CrossOrigin(origins = "*")
public class StockArticleController {

    private final StockArticleRepository repo;

    public StockArticleController(StockArticleRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<StockArticle> findAll() { return repo.findAll(); }

    @GetMapping("/actifs")
    public List<StockArticle> findActifs() { return repo.findByActifTrue(); }

    @GetMapping("/search")
    public List<StockArticle> search(@RequestParam String q) { return repo.search(q); }

    @GetMapping("/alertes")
    public List<StockArticle> alertes() { return repo.findAlertes(); }

    @GetMapping("/{id}")
    public ResponseEntity<StockArticle> findById(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<StockArticle> create(@RequestBody StockArticle a) {
        return ResponseEntity.ok(repo.save(a));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StockArticle> update(@PathVariable Long id, @RequestBody StockArticle data) {
        return repo.findById(id).map(a -> {
            a.setReference(data.getReference());
            a.setDesignation(data.getDesignation());
            a.setDescription(data.getDescription());
            a.setFamille(data.getFamille());
            a.setUnite(data.getUnite());
            a.setFournisseurPrefere(data.getFournisseurPrefere());
            a.setPrixAchatMoyen(data.getPrixAchatMoyen());
            a.setPrixUnitaire(data.getPrixUnitaire());
            a.setStockActuel(data.getStockActuel());
            a.setStockMinimum(data.getStockMinimum());
            a.setStockMaximum(data.getStockMaximum());
            a.setEmplacement(data.getEmplacement());
            a.setTypeArticle(data.getTypeArticle());
            a.setCategorie(data.getCategorie());
            a.setActif(data.getActif());
            return ResponseEntity.ok(repo.save(a));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
