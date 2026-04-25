package com.gestionmagasin.repository;

import com.gestionmagasin.model.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    Article findByArticleCode(String articleCode);
    List<Article> findByArticleNameContainingIgnoreCase(String name);

    @Query("SELECT a FROM Article a WHERE a.stockMinimum IS NOT NULL AND a.stock <= a.stockMinimum")
    List<Article> findAlertes();
}
