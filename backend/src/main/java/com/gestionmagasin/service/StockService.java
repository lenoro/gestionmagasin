package com.gestionmagasin.service;

import com.gestionmagasin.model.*;
import com.gestionmagasin.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class StockService {

    private final ArticleRepository articleRepo;
    private final MouvementStockRepository mouvementRepo;
    private final ApprovisionnementRepository approRepo;
    private final RetourRepository retourRepo;

    public StockService(ArticleRepository articleRepo,
                        MouvementStockRepository mouvementRepo,
                        ApprovisionnementRepository approRepo,
                        RetourRepository retourRepo) {
        this.articleRepo  = articleRepo;
        this.mouvementRepo = mouvementRepo;
        this.approRepo    = approRepo;
        this.retourRepo   = retourRepo;
    }

    // ─── Appelé lors de la création d'une facture ───────────────────────────
    @Transactional
    public void enregistrerSorties(Facture facture) {
        if (facture.getItems() == null) return;
        for (Item item : facture.getItems()) {
            Article article = articleRepo.findById(item.getArticle().getId())
                    .orElseThrow(() -> new RuntimeException("Article introuvable : " + item.getArticle().getId()));

            int avant  = article.getStock();
            int apres  = avant - item.getQuantity();
            article.setStock(apres);
            articleRepo.save(article);

            MouvementStock m = new MouvementStock();
            m.setArticle(article);
            m.setTypeMouvement("SORTIE");
            m.setQuantite(item.getQuantity());
            m.setStockAvant(avant);
            m.setStockApres(apres);
            m.setReference(facture.getInvoiceNumber());
            m.setDateMouvement(LocalDate.now());
            m.setNotes("Facture " + facture.getInvoiceNumber());
            mouvementRepo.save(m);
        }
    }

    // ─── Valider un approvisionnement (ENTREE stock) ─────────────────────────
    @Transactional
    public Approvisionnement validerAppro(int approId) {
        Approvisionnement appro = approRepo.findById(approId)
                .orElseThrow(() -> new RuntimeException("Approvisionnement introuvable : " + approId));

        if ("RECU".equals(appro.getStatut()))
            throw new RuntimeException("Approvisionnement déjà reçu");

        for (ApprovisionnementItem ai : appro.getItems()) {
            Article article = articleRepo.findById(ai.getArticle().getId())
                    .orElseThrow(() -> new RuntimeException("Article introuvable"));

            int avant = article.getStock();
            int apres = avant + ai.getQuantite();
            article.setStock(apres);
            articleRepo.save(article);

            MouvementStock m = new MouvementStock();
            m.setArticle(article);
            m.setTypeMouvement("ENTREE");
            m.setQuantite(ai.getQuantite());
            m.setStockAvant(avant);
            m.setStockApres(apres);
            m.setReference(appro.getReference());
            m.setDateMouvement(LocalDate.now());
            m.setNotes("Appro. " + (appro.getReference() != null ? appro.getReference() : appro.getId()));
            mouvementRepo.save(m);
        }

        appro.setStatut("RECU");
        return approRepo.save(appro);
    }

    // ─── Accepter un retour client (RETOUR_CLIENT → stock +) ────────────────
    @Transactional
    public Retour accepterRetour(int retourId) {
        Retour retour = retourRepo.findById(retourId)
                .orElseThrow(() -> new RuntimeException("Retour introuvable : " + retourId));

        if ("ACCEPTE".equals(retour.getStatut()))
            throw new RuntimeException("Retour déjà accepté");

        for (RetourItem ri : retour.getItems()) {
            Article article = articleRepo.findById(ri.getArticle().getId())
                    .orElseThrow(() -> new RuntimeException("Article introuvable"));

            int avant = article.getStock();
            int apres = avant + ri.getQuantite();
            article.setStock(apres);
            articleRepo.save(article);

            MouvementStock m = new MouvementStock();
            m.setArticle(article);
            m.setTypeMouvement("RETOUR_CLIENT");
            m.setQuantite(ri.getQuantite());
            m.setStockAvant(avant);
            m.setStockApres(apres);
            m.setReference("RET-" + retour.getId());
            m.setDateMouvement(LocalDate.now());
            String numFact = retour.getFacture() != null ? retour.getFacture().getInvoiceNumber() : "?";
            m.setNotes("Retour facture " + numFact);
            mouvementRepo.save(m);
        }

        retour.setStatut("ACCEPTE");
        return retourRepo.save(retour);
    }

    // ─── Ajustement manuel du stock ──────────────────────────────────────────
    @Transactional
    public MouvementStock ajusterStock(int articleId, int nouvelleQte, String notes) {
        Article article = articleRepo.findById(articleId)
                .orElseThrow(() -> new RuntimeException("Article introuvable : " + articleId));

        int avant = article.getStock();
        article.setStock(nouvelleQte);
        articleRepo.save(article);

        MouvementStock m = new MouvementStock();
        m.setArticle(article);
        m.setTypeMouvement("AJUSTEMENT");
        m.setQuantite(Math.abs(nouvelleQte - avant));
        m.setStockAvant(avant);
        m.setStockApres(nouvelleQte);
        m.setDateMouvement(LocalDate.now());
        m.setNotes(notes != null ? notes : "Ajustement manuel");
        return mouvementRepo.save(m);
    }

    // ─── Historique d'un article ─────────────────────────────────────────────
    public List<MouvementStock> historiqueArticle(int articleId) {
        return mouvementRepo.findByArticleIdOrderByDateMouvementDesc(articleId);
    }
}
