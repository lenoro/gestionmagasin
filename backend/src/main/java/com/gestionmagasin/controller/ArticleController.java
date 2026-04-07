package com.gestionmagasin.controller;

import com.gestionmagasin.model.Article;
import com.gestionmagasin.repository.ArticleRepository;
import com.gestionmagasin.service.TraceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/articles")
public class ArticleController {

    private final ArticleRepository repo;
    private final TraceService       traceService;

    public ArticleController(ArticleRepository repo, TraceService traceService) {
        this.repo         = repo;
        this.traceService = traceService;
    }

    @GetMapping
    public List<Article> getAll() { return repo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getById(@PathVariable Integer id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<Article> getByCode(@PathVariable String code) {
        Article a = repo.findByArticleCode(code);
        return a != null ? ResponseEntity.ok(a) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public Article create(@RequestBody Article article) {
        Article saved = repo.save(article);
        traceService.log("ARTICLE", "AJOUT",
                saved.getArticleCode(),
                null,
                saved.getArticleName() + " | Prix: " + saved.getPrice() + " | Stock: " + saved.getStock(),
                "Création article");
        return saved;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Article> update(@PathVariable Integer id, @RequestBody Article data) {
        return repo.findById(id).map(a -> {
            String ancienne = a.getArticleName() + " | Prix: " + a.getPrice() + " | Stock: " + a.getStock();
            a.setArticleCode(data.getArticleCode());
            a.setArticleName(data.getArticleName());
            a.setDescription(data.getDescription());
            a.setPrice(data.getPrice());
            a.setStock(data.getStock());
            a.setProducteur(data.getProducteur());
            Article saved = repo.save(a);
            String nouvelle = saved.getArticleName() + " | Prix: " + saved.getPrice() + " | Stock: " + saved.getStock();
            traceService.log("ARTICLE", "MODIFICATION",
                    saved.getArticleCode(), ancienne, nouvelle, "Modification article");
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        return repo.findById(id).map(a -> {
            traceService.log("ARTICLE", "SUPPRESSION",
                    a.getArticleCode(),
                    a.getArticleName() + " | Prix: " + a.getPrice() + " | Stock: " + a.getStock(),
                    null,
                    "Suppression article");
            repo.deleteById(id);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
