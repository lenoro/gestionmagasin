package com.gestionmagasin.controller;

import com.gestionmagasin.model.Article;
import com.gestionmagasin.repository.ArticleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/articles")
@CrossOrigin(origins = "*")
public class ArticleController {

    private final ArticleRepository repo;

    public ArticleController(ArticleRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Article> getAll() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getById(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<Article> getByCode(@PathVariable String code) {
        Article a = repo.findByArticleCode(code);
        return a != null ? ResponseEntity.ok(a) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public Article create(@RequestBody Article article) {
        if (article.getArticleCode() == null || article.getArticleCode().isBlank()) {
            article.setArticleCode(String.format("ART-%04d", repo.count() + 1));
        }
        return repo.save(article);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Article> update(@PathVariable Long id, @RequestBody Article data) {
        return repo.findById(id).map(a -> {
            a.setArticleCode(data.getArticleCode());
            a.setArticleName(data.getArticleName());
            a.setDescription(data.getDescription());
            a.setPrice(data.getPrice());
            a.setStock(data.getStock());
            a.setProducteur(data.getProducteur());
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
