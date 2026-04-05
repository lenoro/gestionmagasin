package com.gestionmagasin.controller;

import com.gestionmagasin.model.MouvementStock;
import com.gestionmagasin.repository.MouvementStockRepository;
import com.gestionmagasin.service.StockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/mouvements-stock")
public class MouvementStockController {

    private final MouvementStockRepository mouvementRepo;
    private final StockService stockService;

    public MouvementStockController(MouvementStockRepository mouvementRepo, StockService stockService) {
        this.mouvementRepo = mouvementRepo;
        this.stockService  = stockService;
    }

    @GetMapping
    public List<MouvementStock> getAll() {
        return mouvementRepo.findAllByOrderByDateMouvementDesc();
    }

    @GetMapping("/article/{articleId}")
    public List<MouvementStock> getByArticle(@PathVariable int articleId) {
        return mouvementRepo.findByArticleIdOrderByDateMouvementDesc(articleId);
    }

    // Ajustement manuel du stock
    @PostMapping("/ajuster")
    public ResponseEntity<?> ajuster(@RequestBody Map<String, Object> body) {
        try {
            int articleId   = (int) body.get("articleId");
            int nouvelleQte = (int) body.get("nouvelleQte");
            String notes    = (String) body.getOrDefault("notes", "Ajustement manuel");
            MouvementStock m = stockService.ajusterStock(articleId, nouvelleQte, notes);
            return ResponseEntity.ok(m);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
