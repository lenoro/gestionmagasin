package com.gestionmagasin.service;

import com.gestionmagasin.model.*;
import com.gestionmagasin.repository.ArticleRepository;
import com.gestionmagasin.repository.BonSortieRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BonSortieService {

    private final BonSortieRepository bonRepo;
    private final ArticleRepository articleRepo;

    public BonSortieService(BonSortieRepository bonRepo, ArticleRepository articleRepo) {
        this.bonRepo = bonRepo;
        this.articleRepo = articleRepo;
    }

    public String genererNumeroBon() {
        int annee = LocalDate.now().getYear();
        String prefix = "BS-" + annee + "-";
        Optional<String> max = bonRepo.findMaxNumeroByPrefix(prefix);
        int seq = max.map(s -> Integer.parseInt(s.substring(prefix.length())) + 1).orElse(1);
        return String.format("%s%04d", prefix, seq);
    }

    public BonSortie creer(BonSortie bon) {
        for (LigneBonSortie ligne : bon.getLignes()) {
            if (ligne.getArticle().getCategorie() != CategorieArticle.CONSOMMABLE) {
                throw new IllegalArgumentException(
                    "L'article " + ligne.getArticle().getArticleCode() + " n'est pas CONSOMMABLE");
            }
            ligne.setBon(bon);
        }
        bon.setNumeroBon(genererNumeroBon());
        bon.setCreatedAt(LocalDate.now());

        if (bon.getTypeBon() == TypeBonSortie.SORTIE_DIRECTE) {
            decrementerStock(bon.getLignes());
            bon.setStatut(StatutBonSortie.TRAITE);
        } else {
            bon.setStatut(StatutBonSortie.EN_ATTENTE);
        }
        return bonRepo.save(bon);
    }

    public BonSortie approuver(Long id, String visaApprobateur) {
        BonSortie bon = bonRepo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Bon introuvable : " + id));
        decrementerStock(bon.getLignes());
        bon.setVisaApprobateur(visaApprobateur);
        bon.setStatut(StatutBonSortie.TRAITE);
        return bonRepo.save(bon);
    }

    public BonSortie rejeter(Long id, String motif) {
        BonSortie bon = bonRepo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Bon introuvable : " + id));
        bon.setObservations(motif);
        bon.setStatut(StatutBonSortie.REJETE);
        return bonRepo.save(bon);
    }

    public List<BonSortie> findAll() {
        return bonRepo.findAll();
    }

    public BonSortie findById(Long id) {
        return bonRepo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Bon introuvable : " + id));
    }

    private void decrementerStock(List<LigneBonSortie> lignes) {
        for (LigneBonSortie ligne : lignes) {
            Article article = ligne.getArticle();
            if (article.getStock() < ligne.getQuantite()) {
                throw new IllegalStateException(
                    "Stock insuffisant pour : " + article.getArticleCode() +
                    " (disponible: " + article.getStock() + ", demandé: " + ligne.getQuantite() + ")");
            }
            article.setStock(article.getStock() - ligne.getQuantite());
            articleRepo.save(article);
        }
    }
}
