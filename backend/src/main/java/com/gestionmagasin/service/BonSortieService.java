package com.gestionmagasin.service;

import com.gestionmagasin.model.*;
import com.gestionmagasin.repository.*;
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
    private final AffectationRepository affectationRepo;
    private final ConsommateurRepository consommateurRepo;

    public BonSortieService(BonSortieRepository bonRepo, ArticleRepository articleRepo,
                            AffectationRepository affectationRepo, ConsommateurRepository consommateurRepo) {
        this.bonRepo = bonRepo;
        this.articleRepo = articleRepo;
        this.affectationRepo = affectationRepo;
        this.consommateurRepo = consommateurRepo;
    }

    public String genererNumeroBon() {
        int annee = LocalDate.now().getYear();
        String prefix = "BS-" + annee + "-";
        Optional<String> max = bonRepo.findMaxNumeroByPrefix(prefix);
        int seq = max.map(s -> Integer.parseInt(s.substring(prefix.length())) + 1).orElse(1);
        return String.format("%s%04d", prefix, seq);
    }

    public BonSortie creer(BonSortie bon) {
        // Résoudre les entités managées
        if (bon.getServiceDestination() != null && bon.getServiceDestination().getId() != null) {
            bon.setServiceDestination(affectationRepo.findById(bon.getServiceDestination().getId())
                .orElseThrow(() -> new IllegalArgumentException("Service destination introuvable")));
        }
        if (bon.getConsommateur() != null && bon.getConsommateur().getId() != null) {
            bon.setConsommateur(consommateurRepo.findById(bon.getConsommateur().getId()).orElse(null));
        }
        for (LigneBonSortie ligne : bon.getLignes()) {
            if (ligne.getArticle() != null && ligne.getArticle().getId() != null) {
                Article article = articleRepo.findById(ligne.getArticle().getId())
                    .orElseThrow(() -> new IllegalArgumentException(
                        "Article introuvable : " + ligne.getArticle().getId()));
                ligne.setArticle(article);
                if (article.getCategorie() != CategorieArticle.CONSOMMABLE) {
                    throw new IllegalArgumentException(
                        "L'article '" + article.getArticleName() + "' n'est pas consomptible. " +
                        "Pour les biens durables, utilisez le module Inventaire (Transfert).");
                }
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

    public List<BonSortie> findAll() { return bonRepo.findAll(); }

    public BonSortie findById(Long id) {
        return bonRepo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Bon introuvable : " + id));
    }

    private void decrementerStock(List<LigneBonSortie> lignes) {
        for (LigneBonSortie ligne : lignes) {
            Article article = ligne.getArticle();
            if (article.getStock() < ligne.getQuantite()) {
                throw new IllegalStateException(
                    "Stock insuffisant pour '" + article.getArticleName() +
                    "' (disponible: " + article.getStock() + ", demandé: " + ligne.getQuantite() + ")");
            }
            article.setStock(article.getStock() - ligne.getQuantite());
            articleRepo.save(article);
        }
    }
}
