package com.gestionmagasin.service;

import com.gestionmagasin.model.*;
import com.gestionmagasin.repository.ArticleRepository;
import com.gestionmagasin.repository.BonEntreeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BonEntreeService {

    private final BonEntreeRepository bonRepo;
    private final ArticleRepository articleRepo;

    public BonEntreeService(BonEntreeRepository bonRepo, ArticleRepository articleRepo) {
        this.bonRepo = bonRepo;
        this.articleRepo = articleRepo;
    }

    public String genererNumeroBon() {
        int annee = LocalDate.now().getYear();
        String prefix = "BE-" + annee + "-";
        Optional<String> max = bonRepo.findMaxNumeroByPrefix(prefix);
        int seq = max.map(s -> Integer.parseInt(s.substring(prefix.length())) + 1).orElse(1);
        return String.format("%s%04d", prefix, seq);
    }

    public BonEntree creer(BonEntree bon) {
        for (LigneBonEntree ligne : bon.getLignes()) {
            if (ligne.getArticle().getCategorie() != CategorieArticle.CONSOMMABLE) {
                throw new IllegalArgumentException(
                    "L'article " + ligne.getArticle().getArticleCode() + " n'est pas CONSOMMABLE");
            }
            ligne.setBon(bon);
        }
        bon.setNumeroBon(genererNumeroBon());
        bon.setStatut(StatutBonEntree.BROUILLON);
        bon.setCreatedAt(LocalDate.now());
        return bonRepo.save(bon);
    }

    public BonEntree valider(Long id) {
        BonEntree bon = bonRepo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Bon introuvable : " + id));
        if (bon.getStatut() == StatutBonEntree.VALIDE) {
            throw new IllegalStateException("Ce bon est déjà validé");
        }
        for (LigneBonEntree ligne : bon.getLignes()) {
            Article article = ligne.getArticle();
            article.setStock(article.getStock() + ligne.getQuantite());
            articleRepo.save(article);
        }
        bon.setStatut(StatutBonEntree.VALIDE);
        return bonRepo.save(bon);
    }

    public List<BonEntree> findAll() {
        return bonRepo.findAll();
    }

    public BonEntree findById(Long id) {
        return bonRepo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Bon introuvable : " + id));
    }
}
