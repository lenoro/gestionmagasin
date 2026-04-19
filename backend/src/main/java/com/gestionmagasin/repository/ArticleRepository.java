package com.gestionmagasin.repository;

import com.gestionmagasin.model.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    Article findByArticleCode(String articleCode);
    List<Article> findByArticleNameContainingIgnoreCase(String name);
}
