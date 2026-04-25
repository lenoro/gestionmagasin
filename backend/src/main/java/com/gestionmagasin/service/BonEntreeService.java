package com.gestionmagasin.service;

import com.gestionmagasin.model.*;
import com.gestionmagasin.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BonEntreeService {

    private final BonEntreeRepository bonRepo;
    private final ArticleRepository articleRepo;
    private final FournisseurRepository fournisseurRepo;
    private final AffectationRepository affectationRepo;
    private final BienInventaireRepository bienInventaireRepo;

    public BonEntreeService(BonEntreeRepository bonRepo, ArticleRepository articleRepo,
                            FournisseurRepository fournisseurRepo, AffectationRepository affectationRepo,
                            BienInventaireRepository bienInventaireRepo) {
        this.bonRepo = bonRepo;
        this.articleRepo = articleRepo;
        this.fournisseurRepo = fournisseurRepo;
        this.affectationRepo = affectationRepo;
        this.bienInventaireRepo = bienInventaireRepo;
    }

    public String genererNumeroBon() {
        int annee = LocalDate.now().getYear();
        String prefix = "BE-" + annee + "-";
        Optional<String> max = bonRepo.findMaxNumeroByPrefix(prefix);
        int seq = max.map(s -> Integer.parseInt(s.substring(prefix.length())) + 1).orElse(1);
        return String.format("%s%04d", prefix, seq);
    }

    private String genererNumeroInventaire() {
        int annee = LocalDate.now().getYear();
        String prefix = annee + "/";
        Optional<String> max = bienInventaireRepo.findMaxNumeroByPrefix(prefix);
        int seq = max.map(s -> {
            try { return Integer.parseInt(s.substring(prefix.length())) + 1; }
            catch (NumberFormatException e) { return 1; }
        }).orElse(1);
        return String.format("%s%03d", prefix, seq);
    }

    public BonEntree creer(BonEntree bon) {
        // Résoudre les entités managées
        if (bon.getFournisseur() != null && bon.getFournisseur().getId() != null) {
            bon.setFournisseur(fournisseurRepo.findById(bon.getFournisseur().getId()).orElse(null));
        }
        if (bon.getServiceSource() != null && bon.getServiceSource().getId() != null) {
            bon.setServiceSource(affectationRepo.findById(bon.getServiceSource().getId()).orElse(null));
        }
        for (LigneBonEntree ligne : bon.getLignes()) {
            if (ligne.getArticle() != null && ligne.getArticle().getId() != null) {
                Article article = articleRepo.findById(ligne.getArticle().getId())
                    .orElseThrow(() -> new IllegalArgumentException(
                        "Article introuvable : " + ligne.getArticle().getId()));
                ligne.setArticle(article);
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
            if (article.getCategorie() == CategorieArticle.CONSOMMABLE) {
                article.setStock(article.getStock() + ligne.getQuantite());
                articleRepo.save(article);
            } else {
                // NON_CONSOMMABLE : créer une entrée Grand Livre par unité
                for (int i = 0; i < ligne.getQuantite(); i++) {
                    BienInventaire bien = new BienInventaire();
                    bien.setNumeroInventaire(genererNumeroInventaire());
                    bien.setDesignation(article.getArticleName());
                    bien.setDateAcquisition(bon.getDateBon());
                    bien.setPrixAchat(ligne.getPrixUnitaire() != null
                        ? ligne.getPrixUnitaire() : BigDecimal.ZERO);
                    bien.setEtatMateriel(EtatMateriel.BON);
                    bien.setStatut(StatutBien.ACTIF);
                    bien.setCreatedAt(LocalDate.now());
                    bien.setObservations("Issu du bon d'entrée " + bon.getNumeroBon());
                    bienInventaireRepo.save(bien);
                }
            }
        }
        bon.setStatut(StatutBonEntree.VALIDE);
        return bonRepo.save(bon);
    }

    public List<BonEntree> findAll() { return bonRepo.findAll(); }

    public BonEntree findById(Long id) {
        return bonRepo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Bon introuvable : " + id));
    }
}
