package com.gestionmagasin.repository;

import com.gestionmagasin.model.MouvementStock;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MouvementStockRepository extends JpaRepository<MouvementStock, Integer> {
    List<MouvementStock> findByArticleIdOrderByDateMouvementDesc(int articleId);
    List<MouvementStock> findAllByOrderByDateMouvementDesc();
}
