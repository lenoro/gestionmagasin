package com.gestionmagasin.repository;

import com.gestionmagasin.model.StockArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface StockArticleRepository extends JpaRepository<StockArticle, Long> {
    List<StockArticle> findByActifTrue();

    @Query("SELECT a FROM StockArticle a WHERE a.actif = true AND (LOWER(a.designation) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(a.reference) LIKE LOWER(CONCAT('%', :q, '%')))")
    List<StockArticle> search(@Param("q") String q);

    @Query("SELECT a FROM StockArticle a WHERE a.actif = true AND a.stockMinimum IS NOT NULL AND a.stockActuel <= a.stockMinimum")
    List<StockArticle> findAlertes();
}
