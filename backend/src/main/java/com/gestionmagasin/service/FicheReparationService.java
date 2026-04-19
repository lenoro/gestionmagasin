package com.gestionmagasin.service;

import com.gestionmagasin.model.*;
import com.gestionmagasin.repository.ArticleRepository;
import com.gestionmagasin.repository.BienInventaireRepository;
import com.gestionmagasin.repository.FicheReparationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class FicheReparationService {

    private final FicheReparationRepository ficheRepo;
    private final BienInventaireRepository bienRepo;
    private final ArticleRepository articleRepo;

    public FicheReparationService(FicheReparationRepository ficheRepo,
                                   BienInventaireRepository bienRepo,
                                   ArticleRepository articleRepo) {
        this.ficheRepo = ficheRepo;
        this.bienRepo = bienRepo;
        this.articleRepo = articleRepo;
    }

    public String genererNumeroFiche() {
        int annee = LocalDate.now().getYear();
        String prefix = "FR-" + annee + "-";
        Optional<String> max = ficheRepo.findMaxNumeroByPrefix(prefix);
        int seq = max.map(s -> Integer.parseInt(s.substring(prefix.length())) + 1).orElse(1);
        return String.format("%s%04d", prefix, seq);
    }

    public FicheReparation creer(FicheReparation fiche) {
        for (LigneFicheReparation ligne : fiche.getLignes()) {
            if (ligne.getArticle().getCategorie() != CategorieArticle.CONSOMMABLE) {
                throw new IllegalArgumentException(
                    "L'article " + ligne.getArticle().getArticleCode() + " n'est pas CONSOMMABLE");
            }
            ligne.setFiche(fiche);
        }
        fiche.setNumeroFiche(genererNumeroFiche());
        fiche.setStatut(StatutReparation.EN_ATTENTE);
        fiche.setCreatedAt(LocalDate.now());

        BienInventaire bien = fiche.getBien();
        bien.setEtatMateriel(EtatMateriel.EN_REPARATION);
        bienRepo.save(bien);

        return ficheRepo.save(fiche);
    }

    public FicheReparation envoyer(Long id) {
        FicheReparation fiche = ficheRepo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Fiche introuvable : " + id));
        if (fiche.getStatut() != StatutReparation.EN_ATTENTE) {
            throw new IllegalStateException("Transition invalide : statut actuel " + fiche.getStatut());
        }
        fiche.setStatut(StatutReparation.ENVOYE_ATELIER);
        fiche.setDateEnvoi(LocalDate.now());
        return ficheRepo.save(fiche);
    }

    public FicheReparation retourner(Long id) {
        FicheReparation fiche = ficheRepo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Fiche introuvable : " + id));
        if (fiche.getStatut() != StatutReparation.ENVOYE_ATELIER) {
            throw new IllegalStateException("Transition invalide : statut actuel " + fiche.getStatut());
        }
        fiche.setStatut(StatutReparation.RETOURNE);
        fiche.setDateRetour(LocalDate.now());
        return ficheRepo.save(fiche);
    }

    public FicheReparation clore(Long id) {
        FicheReparation fiche = ficheRepo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Fiche introuvable : " + id));
        if (fiche.getStatut() != StatutReparation.RETOURNE) {
            throw new IllegalStateException("Transition invalide : statut actuel " + fiche.getStatut());
        }
        for (LigneFicheReparation ligne : fiche.getLignes()) {
            Article article = ligne.getArticle();
            if (article.getStock() < ligne.getQuantite()) {
                throw new IllegalStateException(
                    "Stock insuffisant pour : " + article.getArticleCode());
            }
            article.setStock(article.getStock() - ligne.getQuantite());
            articleRepo.save(article);
        }
        fiche.setStatut(StatutReparation.CLOS);
        fiche.setDateCloture(LocalDate.now());
        return ficheRepo.save(fiche);
    }

    public List<FicheReparation> findAll() {
        return ficheRepo.findAll();
    }

    public FicheReparation findById(Long id) {
        return ficheRepo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Fiche introuvable : " + id));
    }
}
