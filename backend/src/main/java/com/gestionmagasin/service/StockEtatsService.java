package com.gestionmagasin.service;

import com.gestionmagasin.model.*;
import com.gestionmagasin.repository.*;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class StockEtatsService {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final String ETABLISSEMENT = "CENTRE DE FORMATION PROFESSIONNELLE ET DE L'APPRENTISSAGE";
    private static final Color NOIR = Color.BLACK;

    private final BonEntreeRepository bonEntreeRepo;
    private final BonSortieRepository bonSortieRepo;
    private final BienInventaireRepository bienRepo;
    private final ArticleRepository articleRepo;

    public StockEtatsService(BonEntreeRepository bonEntreeRepo,
                              BonSortieRepository bonSortieRepo,
                              BienInventaireRepository bienRepo,
                              ArticleRepository articleRepo) {
        this.bonEntreeRepo = bonEntreeRepo;
        this.bonSortieRepo = bonSortieRepo;
        this.bienRepo = bienRepo;
        this.articleRepo = articleRepo;
    }

    // ─────────────────────────────────────────────────────────
    // 1. BULLETIN JOURNALIER DE RÉCEPTION — MFP/IG/CMM/BJR/01
    // ─────────────────────────────────────────────────────────
    public byte[] bulletinJournalierReception(LocalDate dateDebut, LocalDate dateFin) {
        List<BonEntree> bons = bonEntreeRepo.findAll().stream()
            .filter(b -> !b.getDateBon().isBefore(dateDebut) && !b.getDateBon().isAfter(dateFin))
            .sorted(Comparator.comparing(BonEntree::getDateBon))
            .collect(Collectors.toList());

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4.rotate(), 20, 20, 20, 20);
            PdfWriter.getInstance(doc, out);
            doc.open();

            // ── En-tête gauche
            Font minFont = new Font(Font.HELVETICA, 7, Font.BOLD);
            Font titreFont = new Font(Font.HELVETICA, 13, Font.BOLD);
            Font refFont  = new Font(Font.HELVETICA, 7);

            PdfPTable header = new PdfPTable(3);
            header.setWidthPercentage(100);
            header.setWidths(new float[]{25f, 50f, 25f});

            // col gauche
            PdfPCell gauche = new PdfPCell();
            gauche.setBorder(Rectangle.NO_BORDER);
            gauche.addElement(new Paragraph("MINISTERE DE LA FORMATION PROFESSIONNELLE", minFont));
            gauche.addElement(new Paragraph(" ", refFont));
            gauche.addElement(new Paragraph(ETABLISSEMENT, minFont));
            gauche.addElement(new Paragraph(" ", refFont));
            gauche.addElement(new Paragraph("DE ___________________", refFont));
            header.addCell(gauche);

            // col centre (titre)
            PdfPCell centre = new PdfPCell();
            centre.setBorder(Rectangle.NO_BORDER);
            centre.setHorizontalAlignment(Element.ALIGN_CENTER);
            centre.setVerticalAlignment(Element.ALIGN_MIDDLE);
            Paragraph titrePara = new Paragraph("BULLETIN JOURNALIER DE RÉCEPTION", titreFont);
            titrePara.setAlignment(Element.ALIGN_CENTER);
            centre.addElement(titrePara);
            centre.addElement(new Paragraph(" ", refFont));
            Paragraph matPara = new Paragraph("Matériaux □   Matériel □", refFont);
            matPara.setAlignment(Element.ALIGN_CENTER);
            centre.addElement(matPara);
            header.addCell(centre);

            // col droite
            PdfPCell droite = new PdfPCell();
            droite.setBorder(Rectangle.NO_BORDER);
            droite.setHorizontalAlignment(Element.ALIGN_RIGHT);
            droite.addElement(new Paragraph("Feuillet N° ___________", refFont));
            droite.addElement(new Paragraph("Journée du : " + dateDebut.format(FMT) + " au " + dateFin.format(FMT), refFont));
            droite.addElement(new Paragraph(" ", refFont));
            droite.addElement(new Paragraph("MFP/IG/CMM/BJR/01", new Font(Font.HELVETICA, 7, Font.BOLD)));
            header.addCell(droite);

            doc.add(header);
            doc.add(new Paragraph(" ", refFont));

            // ── Tableau données
            String[] cols = {"Date de\nRéception", "Provenance", "Désignation", "N°\n(P.J.)", "Date\n(P.J.)", "Quantité",
                             "Reçu conforme\nle Magasinier", "Pointage", "Division\n(Fiches)", "N°\n(Fiches)"};
            float[] widths = {3f, 4f, 6f, 2f, 2.5f, 2f, 4f, 2f, 2.5f, 2f};

            PdfPTable table = tableAvecEntetes(cols, widths, 7f);

            Font cf = new Font(Font.HELVETICA, 7);
            int nbLignes = 0;
            for (BonEntree bon : bons) {
                for (LigneBonEntree ligne : bon.getLignes()) {
                    table.addCell(cellule(bon.getDateBon().format(FMT), cf));
                    String prov = bon.getFournisseur() != null ? bon.getFournisseur().getRaisonSociale()
                        : (bon.getServiceSource() != null ? bon.getServiceSource().getLibelle() : "");
                    table.addCell(cellule(prov, cf));
                    table.addCell(cellule(ligne.getArticle().getArticleName(), cf));
                    table.addCell(cellule(bon.getNumeroBon(), cf));
                    table.addCell(cellule(bon.getDateBon().format(FMT), cf));
                    table.addCell(celluleRight(String.valueOf(ligne.getQuantite()), cf));
                    table.addCell(cellule(bon.getVisa() != null ? bon.getVisa() : "", cf));
                    table.addCell(cellule("", cf));
                    table.addCell(cellule("", cf));
                    table.addCell(cellule("", cf));
                    nbLignes++;
                }
            }
            // lignes vides pour compléter
            for (int i = nbLignes; i < Math.max(nbLignes + 3, 10); i++) {
                for (int j = 0; j < cols.length; j++) table.addCell(celluleVide(cf, 14f));
            }
            doc.add(table);

            // ── VISAS
            doc.add(new Paragraph(" ", refFont));
            doc.add(visasBJR());

            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur génération BJR", e);
        }
    }

    // ─────────────────────────────────────────────────────────
    // 2. ÉTAT JOURNALIER DES SORTIES — MFP/IG/CMM/EJS/02
    // ─────────────────────────────────────────────────────────
    public byte[] etatJournalierSorties(LocalDate dateDebut, LocalDate dateFin) {
        List<BonSortie> bons = bonSortieRepo.findAll().stream()
            .filter(b -> !b.getDateBon().isBefore(dateDebut) && !b.getDateBon().isAfter(dateFin))
            .sorted(Comparator.comparing(BonSortie::getDateBon))
            .collect(Collectors.toList());

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4.rotate(), 20, 20, 20, 20);
            PdfWriter.getInstance(doc, out);
            doc.open();

            Font minFont = new Font(Font.HELVETICA, 7, Font.BOLD);
            Font titreFont = new Font(Font.HELVETICA, 13, Font.BOLD);
            Font refFont  = new Font(Font.HELVETICA, 7);

            PdfPTable header = new PdfPTable(3);
            header.setWidthPercentage(100);
            header.setWidths(new float[]{25f, 50f, 25f});

            PdfPCell gauche = new PdfPCell();
            gauche.setBorder(Rectangle.NO_BORDER);
            gauche.addElement(new Paragraph("MINISTERE DE LA FORMATION PROFESSIONNELLE", minFont));
            gauche.addElement(new Paragraph(" ", refFont));
            gauche.addElement(new Paragraph(ETABLISSEMENT, minFont));
            gauche.addElement(new Paragraph(" ", refFont));
            gauche.addElement(new Paragraph("DE ___________________", refFont));
            header.addCell(gauche);

            PdfPCell centre = new PdfPCell();
            centre.setBorder(Rectangle.NO_BORDER);
            centre.setHorizontalAlignment(Element.ALIGN_CENTER);
            centre.setVerticalAlignment(Element.ALIGN_MIDDLE);
            Paragraph titrePara = new Paragraph("ÉTAT JOURNALIER DES SORTIES", titreFont);
            titrePara.setAlignment(Element.ALIGN_CENTER);
            centre.addElement(titrePara);
            centre.addElement(new Paragraph(" ", refFont));
            Paragraph matPara = new Paragraph("Matériaux □   Matériel □", refFont);
            matPara.setAlignment(Element.ALIGN_CENTER);
            centre.addElement(matPara);
            header.addCell(centre);

            PdfPCell droite = new PdfPCell();
            droite.setBorder(Rectangle.NO_BORDER);
            droite.setHorizontalAlignment(Element.ALIGN_RIGHT);
            droite.addElement(new Paragraph("Feuillet N° ___________", refFont));
            droite.addElement(new Paragraph("Semaine du : " + dateDebut.format(FMT), refFont));
            droite.addElement(new Paragraph("au : " + dateFin.format(FMT), refFont));
            droite.addElement(new Paragraph(" ", refFont));
            droite.addElement(new Paragraph("MFP/IG/CMM/EJS/02", new Font(Font.HELVETICA, 7, Font.BOLD)));
            header.addCell(droite);

            doc.add(header);
            doc.add(new Paragraph(" ", refFont));

            String[] cols = {"N°", "Bénéficiaire\nde la Sortie", "Désignation des Articles",
                             "N°\n(P.J.)", "Date\n(P.J.)", "Quantité", "Pointage",
                             "Division\n(Fiches)", "N°\n(Fiches)", "Observations"};
            float[] widths = {1.5f, 4f, 6f, 2f, 2.5f, 2f, 2f, 2.5f, 2f, 3f};

            PdfPTable table = tableAvecEntetes(cols, widths, 7f);
            Font cf = new Font(Font.HELVETICA, 7);
            int no = 1;
            int nbLignes = 0;
            for (BonSortie bon : bons) {
                for (LigneBonSortie ligne : bon.getLignes()) {
                    table.addCell(celluleRight(String.valueOf(no++), cf));
                    String benef = bon.getServiceDestination() != null ? bon.getServiceDestination().getLibelle() : "";
                    table.addCell(cellule(benef, cf));
                    table.addCell(cellule(ligne.getArticle().getArticleName(), cf));
                    table.addCell(cellule(bon.getNumeroBon(), cf));
                    table.addCell(cellule(bon.getDateBon().format(FMT), cf));
                    table.addCell(celluleRight(String.valueOf(ligne.getQuantite()), cf));
                    table.addCell(cellule(bon.getVisaMagasinier() != null ? bon.getVisaMagasinier() : "", cf));
                    table.addCell(cellule("", cf));
                    table.addCell(cellule("", cf));
                    table.addCell(cellule(bon.getObservations() != null ? bon.getObservations() : "", cf));
                    nbLignes++;
                }
            }
            for (int i = nbLignes; i < Math.max(nbLignes + 3, 10); i++) {
                for (int j = 0; j < cols.length; j++) table.addCell(celluleVide(cf, 14f));
            }
            doc.add(table);

            doc.add(new Paragraph(" ", refFont));
            doc.add(visasEJS());

            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur génération EJS", e);
        }
    }

    // ─────────────────────────────────────────────────────────
    // 3. ÉTAT DU MATÉRIEL À PROPOSER À LA RÉFORME
    // ─────────────────────────────────────────────────────────
    public byte[] etatMaterielReforme() {
        List<BienInventaire> biens = bienRepo.findAll().stream()
            .filter(b -> b.getStatut() == StatutBien.REFORME
                      || b.getEtatMateriel() == EtatMateriel.HORS_SERVICE)
            .sorted(Comparator.comparing(BienInventaire::getDesignation))
            .collect(Collectors.toList());

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4, 30, 30, 30, 30);
            PdfWriter.getInstance(doc, out);
            doc.open();

            Font labelFont = new Font(Font.HELVETICA, 9);

            doc.add(enteteEtablissement("ÉTAT DU MATÉRIEL À PROPOSER À LA RÉFORME", ""));
            doc.add(new Paragraph(" ", labelFont));

            Paragraph passage = new Paragraph("Passage du : ............................................", labelFont);
            passage.setAlignment(Element.ALIGN_CENTER);
            doc.add(passage);
            doc.add(new Paragraph(" ", labelFont));

            String[] cols = {"Enseignants\nou Agents", "Sections\nou Services",
                             "Désignations des articles\n(Inutilisables)", "Quantité",
                             "Date de\nRécupération", "Observations"};
            float[] widths = {3f, 3f, 6f, 2f, 3f, 4f};
            PdfPTable table = tableAvecEntetes(cols, widths, 9f);
            Font cf = new Font(Font.HELVETICA, 8);

            int nb = 0;
            for (BienInventaire bien : biens) {
                String agent = bien.getAffectationLibre() != null ? bien.getAffectationLibre()
                    : (bien.getAffectation() != null ? bien.getAffectation().getLibelle() : "");
                String section = bien.getAffectation() != null ? bien.getAffectation().getCode() : "";
                table.addCell(cellule(agent, cf));
                table.addCell(cellule(section, cf));
                table.addCell(cellule(bien.getDesignation(), cf));
                table.addCell(celluleRight("1", cf));
                table.addCell(cellule("", cf));
                table.addCell(cellule(bien.getObservations() != null ? bien.getObservations() : "", cf));
                nb++;
            }
            for (int i = nb; i < Math.max(nb + 3, 15); i++) {
                for (int j = 0; j < cols.length; j++) table.addCell(celluleVide(cf, 18f));
            }
            doc.add(table);

            doc.add(new Paragraph(" ", labelFont));
            // Signatures bas
            PdfPTable sigs = new PdfPTable(3);
            sigs.setWidthPercentage(100);
            sigs.setWidths(new float[]{33f, 34f, 33f});
            PdfPCell s1 = celluleSig("Un membre de la\ncommission d'inventaire");
            PdfPCell s2 = celluleSig("L'intendant.");
            PdfPCell s3 = celluleSig("le Magasinier.");
            sigs.addCell(s1); sigs.addCell(s2); sigs.addCell(s3);
            doc.add(sigs);

            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur génération état réforme", e);
        }
    }

    // ─────────────────────────────────────────────────────────
    // 4. ÉTAT DES BESOINS
    // ─────────────────────────────────────────────────────────
    public byte[] etatDesBesoins(String section, String agent, int annee) {
        List<Article> articles = articleRepo.findAll().stream()
            .filter(a -> a.getCategorie() == CategorieArticle.CONSOMMABLE)
            .sorted(Comparator.comparing(Article::getArticleName))
            .collect(Collectors.toList());

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4, 30, 30, 30, 30);
            PdfWriter.getInstance(doc, out);
            doc.open();

            Font labelFont = new Font(Font.HELVETICA, 9);
            Font smallFont = new Font(Font.HELVETICA, 8);

            doc.add(enteteEtablissement("ÉTAT DES BESOINS", ""));
            Paragraph anneeP = new Paragraph("ANNÉE : " + annee, labelFont);
            anneeP.setAlignment(Element.ALIGN_CENTER);
            doc.add(anneeP);
            doc.add(new Paragraph(" ", labelFont));

            // en-tête section / agent
            PdfPTable entete = new PdfPTable(2);
            entete.setWidthPercentage(100);
            entete.setWidths(new float[]{50f, 50f});
            PdfPCell c1 = new PdfPCell(new Paragraph("Section ou Service : " + (section != null ? section : ""), labelFont));
            c1.setBorder(Rectangle.NO_BORDER);
            PdfPCell c2 = new PdfPCell(new Paragraph("Enseignant ou Agent : " + (agent != null ? agent : ""), labelFont));
            c2.setBorder(Rectangle.NO_BORDER);
            c2.setHorizontalAlignment(Element.ALIGN_RIGHT);
            entete.addCell(c1); entete.addCell(c2);
            doc.add(entete);
            doc.add(new Paragraph(" ", smallFont));

            // Tableau
            String[] cols = {"Désignation des articles",
                             "Quantités\nDemandées\npour l'année",
                             "Restantes\nen atelier",
                             "Stocks au\nmagasin\nGénéral",
                             "Quantités\nà acheter",
                             "Observations"};
            float[] widths = {7f, 3f, 3f, 3f, 3f, 4f};
            PdfPTable table = tableAvecEntetes(cols, widths, 9f);
            Font cf = new Font(Font.HELVETICA, 8);

            int nb = 0;
            for (Article art : articles) {
                table.addCell(cellule(art.getArticleName(), cf));
                table.addCell(cellule("", cf));
                table.addCell(cellule("", cf));
                table.addCell(celluleRight(String.valueOf(art.getStock()), cf));
                table.addCell(cellule("", cf));
                table.addCell(cellule("", cf));
                nb++;
            }
            for (int i = nb; i < Math.max(nb + 3, 15); i++) {
                for (int j = 0; j < cols.length; j++) table.addCell(celluleVide(cf, 18f));
            }
            doc.add(table);
            doc.add(new Paragraph(" ", smallFont));

            // Note
            Paragraph note = new Paragraph("NB: Le contenu peut être modifié en fonction des renseignements voulus.", smallFont);
            note.setAlignment(Element.ALIGN_CENTER);
            doc.add(note);
            doc.add(new Paragraph(" ", smallFont));

            // Signatures
            PdfPTable sigs = new PdfPTable(2);
            sigs.setWidthPercentage(100);
            sigs.setWidths(new float[]{50f, 50f});
            sigs.addCell(celluleSig("L'A.T.P. / L'Intendant"));
            sigs.addCell(celluleSig("L'enseignant ou L'agent"));
            doc.add(sigs);

            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur génération état des besoins", e);
        }
    }

    // ─────────────────────────────────────────────────────────
    // 5. FICHIER CENTRAL — MATÉRIEL CONSOMPTIBLE — MFP/IG/CMM/FC/MC/05
    // ─────────────────────────────────────────────────────────
    public byte[] fichierCentralConsomptible(Long articleId) {
        Article article = articleRepo.findById(articleId)
            .orElseThrow(() -> new RuntimeException("Article non trouvé"));

        // Collecte tous les mouvements (entrées et sorties)
        List<Object[]> mouvements = new ArrayList<>();

        // Entrées
        for (LigneBonEntree l : bonEntreeRepo.findAll().stream()
                .flatMap(b -> b.getLignes().stream())
                .filter(l -> l.getArticle().getId().equals(articleId))
                .sorted(Comparator.comparing(l -> l.getBon().getDateBon()))
                .collect(Collectors.toList())) {
            BonEntree bon = l.getBon();
            mouvements.add(new Object[]{
                bon.getDateBon(), bon.getNumeroBon(),
                "Entrée", l.getPrixUnitaire(),
                bon.getNumeroBon(), bon.getDateBon(),
                l.getQuantite(), "", 0, null
            });
        }

        // Sorties
        for (LigneBonSortie l : bonSortieRepo.findAll().stream()
                .flatMap(b -> b.getLignes().stream())
                .filter(l -> l.getArticle().getId().equals(articleId))
                .sorted(Comparator.comparing(l -> l.getBon().getDateBon()))
                .collect(Collectors.toList())) {
            BonSortie bon = l.getBon();
            String benef = bon.getServiceDestination() != null ? bon.getServiceDestination().getLibelle() : "";
            mouvements.add(new Object[]{
                bon.getDateBon(), bon.getNumeroBon(),
                "Sortie", article.getPrice(),
                bon.getNumeroBon(), bon.getDateBon(),
                0, benef, l.getQuantite(), null
            });
        }

        // Tri par date
        mouvements.sort(Comparator.comparing(r -> (LocalDate) r[0]));

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4.rotate(), 15, 15, 20, 20);
            PdfWriter.getInstance(doc, out);
            doc.open();

            Font minFont = new Font(Font.HELVETICA, 7, Font.BOLD);
            Font titreFont = new Font(Font.HELVETICA, 11, Font.BOLD);
            Font refFont  = new Font(Font.HELVETICA, 7);

            PdfPTable header = new PdfPTable(3);
            header.setWidthPercentage(100);
            header.setWidths(new float[]{20f, 60f, 20f});

            PdfPCell gauche = new PdfPCell();
            gauche.setBorder(Rectangle.NO_BORDER);
            gauche.addElement(new Paragraph("MINISTERE DE LA FORMATION\nPROFESSIONNELLE", minFont));
            gauche.addElement(new Paragraph(" ", refFont));
            gauche.addElement(new Paragraph("ETABLISSEMENT", minFont));
            gauche.addElement(new Paragraph("___________________", refFont));
            header.addCell(gauche);

            PdfPCell centre = new PdfPCell();
            centre.setBorder(Rectangle.NO_BORDER);
            centre.setHorizontalAlignment(Element.ALIGN_CENTER);
            Paragraph desig = new Paragraph("Désignation de l'Article : " + article.getArticleName(), refFont);
            desig.setAlignment(Element.ALIGN_CENTER);
            centre.addElement(desig);
            centre.addElement(new Paragraph(" ", refFont));
            Paragraph titFC = new Paragraph("FICHIER CENTRAL", titreFont);
            titFC.setAlignment(Element.ALIGN_CENTER);
            centre.addElement(titFC);
            centre.addElement(new Paragraph(" ", refFont));
            Paragraph titType = new Paragraph("MATÉRIEL CONSOMPTIBLE", titreFont);
            titType.setAlignment(Element.ALIGN_CENTER);
            centre.addElement(titType);
            header.addCell(centre);

            PdfPCell droite = new PdfPCell();
            droite.setBorder(Rectangle.NO_BORDER);
            droite.setHorizontalAlignment(Element.ALIGN_RIGHT);
            droite.addElement(new Paragraph("Fiche No : " + article.getArticleCode(), refFont));
            droite.addElement(new Paragraph(" ", refFont));
            droite.addElement(new Paragraph("Division : ___________", refFont));
            droite.addElement(new Paragraph(" ", refFont));
            droite.addElement(new Paragraph("MFP/IG/CMM/FC/MC/05", new Font(Font.HELVETICA, 7, Font.BOLD)));
            header.addCell(droite);

            doc.add(header);
            doc.add(new Paragraph(" ", refFont));

            // Colonnes avec numéros
            String[] cols = {"1\nN° ordre", "2\nN° Enregist.\nR.G.E.", "3\nNature de\nl'opération",
                             "4\nDate", "5\nValeur d'achat\nou d'estimation",
                             "6\nN° (P.J.)", "7\nDate (P.J.)",
                             "8\nEntrées", "9\nBénéficiaires\ndes Sorties",
                             "10\nSorties", "11\nStocks", "12\nObservations"};
            float[] widths = {1.5f, 2.5f, 3f, 2.5f, 3f, 2.5f, 2.5f, 2f, 4f, 2f, 2f, 3f};
            PdfPTable table = tableAvecEntetes(cols, widths, 6f);
            Font cf = new Font(Font.HELVETICA, 7);

            int stock = article.getStock(); // stock courant, on recalcule à rebours si souhaité
            // Calcul du stock initial
            int totalEntrees = mouvements.stream().mapToInt(r -> (Integer) r[6]).sum();
            int totalSorties = mouvements.stream().mapToInt(r -> (Integer) r[8]).sum();
            int stockInitial = stock - totalEntrees + totalSorties;
            int stockCourant = stockInitial;

            int ordre = 1;
            int nb = 0;
            for (Object[] mv : mouvements) {
                LocalDate date = (LocalDate) mv[0];
                String numBon = (String) mv[1];
                String nature = (String) mv[2];
                Object valeur = mv[3];
                int entrees = (Integer) mv[6];
                String benef = (String) mv[7];
                int sorties = (Integer) mv[8];

                stockCourant += entrees - sorties;

                table.addCell(celluleRight(String.valueOf(ordre++), cf));
                table.addCell(cellule(numBon, cf));
                table.addCell(cellule(nature, cf));
                table.addCell(cellule(date.format(FMT), cf));
                table.addCell(celluleRight(valeur != null ? valeur.toString() : "", cf));
                table.addCell(cellule(numBon, cf));
                table.addCell(cellule(date.format(FMT), cf));
                table.addCell(celluleRight(entrees > 0 ? String.valueOf(entrees) : "", cf));
                table.addCell(cellule(benef, cf));
                table.addCell(celluleRight(sorties > 0 ? String.valueOf(sorties) : "", cf));
                table.addCell(celluleRight(String.valueOf(stockCourant), cf));
                table.addCell(cellule("", cf));
                nb++;
            }
            for (int i = nb; i < Math.max(nb + 3, 12); i++) {
                for (int j = 0; j < cols.length; j++) table.addCell(celluleVide(cf, 14f));
            }
            doc.add(table);
            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur génération FC/MC", e);
        }
    }

    // ─────────────────────────────────────────────────────────
    // 6. FICHIER CENTRAL — MATÉRIEL NON CONSOMPTIBLE — MFP/IG/CMM/FC/MNC/06
    // ─────────────────────────────────────────────────────────
    public byte[] fichierCentralNonConsomptible(Long bienId) {
        BienInventaire bien = bienRepo.findById(bienId)
            .orElseThrow(() -> new RuntimeException("Bien inventaire non trouvé"));

        List<MouvementInventaire> mouvements = bien.getMouvements() != null ?
            bien.getMouvements().stream()
                .sorted(Comparator.comparing(MouvementInventaire::getDateOperation))
                .collect(Collectors.toList())
            : Collections.emptyList();

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4.rotate(), 15, 15, 20, 20);
            PdfWriter.getInstance(doc, out);
            doc.open();

            Font minFont = new Font(Font.HELVETICA, 7, Font.BOLD);
            Font titreFont = new Font(Font.HELVETICA, 11, Font.BOLD);
            Font refFont  = new Font(Font.HELVETICA, 7);

            PdfPTable header = new PdfPTable(3);
            header.setWidthPercentage(100);
            header.setWidths(new float[]{20f, 60f, 20f});

            PdfPCell gauche = new PdfPCell();
            gauche.setBorder(Rectangle.NO_BORDER);
            gauche.addElement(new Paragraph("MINISTERE DE LA FORMATION\nPROFESSIONNELLE", minFont));
            gauche.addElement(new Paragraph(" ", refFont));
            gauche.addElement(new Paragraph("ETABLISSEMENT", minFont));
            gauche.addElement(new Paragraph("___________________", refFont));
            header.addCell(gauche);

            PdfPCell centre = new PdfPCell();
            centre.setBorder(Rectangle.NO_BORDER);
            centre.setHorizontalAlignment(Element.ALIGN_CENTER);
            Paragraph desig = new Paragraph("Désignation de l'Article : " + bien.getDesignation(), refFont);
            desig.setAlignment(Element.ALIGN_CENTER);
            centre.addElement(desig);
            centre.addElement(new Paragraph(" ", refFont));
            Paragraph titFC = new Paragraph("FICHIER CENTRAL", titreFont);
            titFC.setAlignment(Element.ALIGN_CENTER);
            centre.addElement(titFC);
            centre.addElement(new Paragraph(" ", refFont));
            Paragraph titType = new Paragraph("MATÉRIEL NON CONSOMPTIBLE", titreFont);
            titType.setAlignment(Element.ALIGN_CENTER);
            centre.addElement(titType);
            header.addCell(centre);

            PdfPCell droite = new PdfPCell();
            droite.setBorder(Rectangle.NO_BORDER);
            droite.setHorizontalAlignment(Element.ALIGN_RIGHT);
            droite.addElement(new Paragraph("Fiche No : " + bien.getNumeroInventaire(), refFont));
            droite.addElement(new Paragraph(" ", refFont));
            droite.addElement(new Paragraph("Division : ___________", refFont));
            droite.addElement(new Paragraph(" ", refFont));
            droite.addElement(new Paragraph("MFP/IG/CMM/FC/MNC/06", new Font(Font.HELVETICA, 7, Font.BOLD)));
            header.addCell(droite);

            doc.add(header);
            doc.add(new Paragraph(" ", refFont));

            String[] cols = {"1\nN° ordre", "2\nN° Enregist.\nregistre\nd'inventaire",
                             "3\nNature de\nl'opération", "4\nDate",
                             "5\nValeur d'achat\nou d'estimation",
                             "6\nN° (P.J.)", "7\nDate (P.J.)",
                             "8\nEntrées",
                             "9\nBénéficiaires des\ncessions ou transferts",
                             "10\nSorties\ndéfinit.", "11\nStocks", "12\nObservations"};
            float[] widths = {1.5f, 2.5f, 3f, 2.5f, 3f, 2.5f, 2.5f, 2f, 4f, 2f, 2f, 3f};
            PdfPTable table = tableAvecEntetes(cols, widths, 6f);
            Font cf = new Font(Font.HELVETICA, 7);

            // Ligne d'acquisition initiale
            int ordre = 1;
            table.addCell(celluleRight(String.valueOf(ordre++), cf));
            table.addCell(cellule(bien.getNumeroInventaire(), cf));
            table.addCell(cellule("Acquisition", cf));
            table.addCell(cellule(bien.getDateAcquisition().format(FMT), cf));
            table.addCell(celluleRight(bien.getPrixAchat().toPlainString(), cf));
            table.addCell(cellule("", cf));
            table.addCell(cellule(bien.getDateAcquisition().format(FMT), cf));
            table.addCell(celluleRight("1", cf));
            table.addCell(cellule("", cf));
            table.addCell(cellule("", cf));
            table.addCell(celluleRight("1", cf));
            table.addCell(cellule("", cf));

            int stock = 1;
            int nb = 1;
            for (MouvementInventaire mv : mouvements) {
                boolean isSortie = mv.getTypeMouvement() == TypeMouvement.REFORME;
                if (isSortie) stock--;

                table.addCell(celluleRight(String.valueOf(ordre++), cf));
                table.addCell(cellule(bien.getNumeroInventaire(), cf));
                table.addCell(cellule(mv.getTypeMouvement().name(), cf));
                table.addCell(cellule(mv.getDateOperation().format(FMT), cf));
                table.addCell(cellule("", cf));
                table.addCell(cellule("", cf));
                table.addCell(cellule(mv.getDateOperation().format(FMT), cf));
                table.addCell(cellule(!isSortie ? "1" : "", cf));
                table.addCell(cellule(mv.getAffectationDestination() != null ? mv.getAffectationDestination() : "", cf));
                table.addCell(cellule(isSortie ? "1" : "", cf));
                table.addCell(celluleRight(String.valueOf(Math.max(0, stock)), cf));
                table.addCell(cellule(mv.getMotif(), cf));
                nb++;
            }
            for (int i = nb; i < Math.max(nb + 3, 12); i++) {
                for (int j = 0; j < cols.length; j++) table.addCell(celluleVide(cf, 14f));
            }
            doc.add(table);
            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur génération FC/MNC", e);
        }
    }

    // ─────────────────────────────────────────────────────────
    // Helpers communs
    // ─────────────────────────────────────────────────────────
    private PdfPTable tableAvecEntetes(String[] colonnes, float[] widths, float fontSize) throws DocumentException {
        PdfPTable table = new PdfPTable(colonnes.length);
        table.setWidthPercentage(100);
        table.setWidths(widths);
        Font hf = new Font(Font.HELVETICA, fontSize, Font.BOLD, Color.BLACK);
        for (String col : colonnes) {
            PdfPCell cell = new PdfPCell(new Phrase(col, hf));
            cell.setBackgroundColor(new Color(200, 220, 240));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            cell.setPadding(3);
            cell.setBorderColor(NOIR);
            table.addCell(cell);
        }
        return table;
    }

    private PdfPCell cellule(String texte, Font f) {
        PdfPCell c = new PdfPCell(new Phrase(texte != null ? texte : "", f));
        c.setPadding(3);
        c.setBorderColor(NOIR);
        return c;
    }

    private PdfPCell celluleRight(String texte, Font f) {
        PdfPCell c = cellule(texte, f);
        c.setHorizontalAlignment(Element.ALIGN_RIGHT);
        return c;
    }

    private PdfPCell celluleVide(Font f, float height) {
        PdfPCell c = new PdfPCell(new Phrase(" ", f));
        c.setFixedHeight(height);
        c.setBorderColor(NOIR);
        return c;
    }

    private PdfPCell celluleSig(String texte) {
        Font f = new Font(Font.HELVETICA, 8);
        PdfPCell c = new PdfPCell(new Phrase(texte, f));
        c.setBorder(Rectangle.NO_BORDER);
        c.setPaddingTop(5);
        c.setHorizontalAlignment(Element.ALIGN_CENTER);
        c.setFixedHeight(50f);
        return c;
    }

    private PdfPTable visasBJR() throws DocumentException {
        Font f = new Font(Font.HELVETICA, 8);
        Font fb = new Font(Font.HELVETICA, 8, Font.BOLD);
        PdfPTable visas = new PdfPTable(4);
        visas.setWidthPercentage(100);
        visas.setWidths(new float[]{25f, 25f, 25f, 25f});

        // Titre VISAS sur toute la largeur
        PdfPCell titre = new PdfPCell(new Phrase("- VISAS -", fb));
        titre.setColspan(4);
        titre.setHorizontalAlignment(Element.ALIGN_CENTER);
        titre.setBorder(Rectangle.TOP | Rectangle.LEFT | Rectangle.RIGHT);
        visas.addCell(titre);

        PdfPCell m = new PdfPCell(); m.setPadding(4); m.setBorder(Rectangle.BOX);
        m.addElement(new Paragraph("MAGASIN", fb));
        m.addElement(new Paragraph("Etabli le : ___________", f));
        visas.addCell(m);

        PdfPCell cm = new PdfPCell(); cm.setPadding(4); cm.setBorder(Rectangle.BOX);
        cm.addElement(new Paragraph("Comptabilité Matière", fb));
        cm.addElement(new Paragraph("Reporté le : ___________", f));
        visas.addCell(cm);

        PdfPCell intend = new PdfPCell(); intend.setPadding(4); intend.setBorder(Rectangle.BOX);
        intend.addElement(new Paragraph("L'Intendant", fb));
        intend.addElement(new Paragraph("Visé le : ___________", f));
        visas.addCell(intend);

        PdfPCell dir = new PdfPCell(); dir.setPadding(4); dir.setBorder(Rectangle.BOX);
        dir.addElement(new Paragraph("Le Directeur du Centre", fb));
        dir.addElement(new Paragraph("Visé le : ___________", f));
        visas.addCell(dir);

        return visas;
    }

    // ─────────────────────────────────────────────────────────
    // 7 (A). REGISTRE DE SUIVI DES RESSOURCES — RSR
    //        Colonnes : N° Inventaire | Désignation | Marque/Modèle | Qté |
    //                   État de conservation | Emplacement | Date d'entrée | Observations
    // ─────────────────────────────────────────────────────────
    public byte[] registreSuiviRSR() {
        List<BienInventaire> biens = bienRepo.findAll().stream()
            .sorted(Comparator.comparing(BienInventaire::getNumeroInventaire))
            .collect(Collectors.toList());

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4.rotate(), 20, 20, 20, 20);
            PdfWriter.getInstance(doc, out);
            doc.open();

            Font labelFont = new Font(Font.HELVETICA, 9);

            doc.add(enteteEtablissement("REGISTRE DE SUIVI DES RESSOURCES (RSR)", ""));
            doc.add(new Paragraph(" ", labelFont));

            String[] cols = {
                "N° Inventaire",
                "Désignation précise\ndu bien",
                "Marque\n/ Modèle",
                "Quantité",
                "État de\nconservation",
                "Emplacement\n(Salle)",
                "Date\nd'entrée",
                "Observations"
            };
            float[] widths = {3f, 5f, 3f, 2f, 3f, 3.5f, 3f, 4f};
            PdfPTable table = tableAvecEntetes(cols, widths, 8f);
            Font cf = new Font(Font.HELVETICA, 8);

            int nb = 0;
            for (BienInventaire b : biens) {
                table.addCell(cellule(b.getNumeroInventaire(), cf));
                table.addCell(cellule(b.getDesignation(), cf));
                table.addCell(cellule(b.getMarqueModele() != null ? b.getMarqueModele() : "", cf));
                table.addCell(celluleRight("01", cf));
                table.addCell(cellule(etatLabel(b.getEtatMateriel()), cf));
                table.addCell(cellule(affLabel(b), cf));
                table.addCell(cellule(b.getDateAcquisition() != null ? b.getDateAcquisition().format(FMT) : "", cf));
                table.addCell(cellule(b.getObservations() != null ? b.getObservations() : "-", cf));
                nb++;
            }
            for (int i = nb; i < Math.max(nb + 3, 10); i++) {
                for (int j = 0; j < cols.length; j++) table.addCell(celluleVide(cf, 16f));
            }
            doc.add(table);
            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur génération RSR", e);
        }
    }

    // ─────────────────────────────────────────────────────────
    // 7 (B). REGISTRE MATIÈRE DÉTAILLÉ (TABLEAU)
    //        Colonnes : N° Inventaire | Désignation | Marque & N° Série |
    //                   Date Entrée | Mode Acquisition | Prix Achat |
    //                   Affectation | Date / Motif Sortie
    // ─────────────────────────────────────────────────────────
    public byte[] registreMatiere() {
        List<BienInventaire> biens = bienRepo.findAll().stream()
            .sorted(Comparator.comparing(BienInventaire::getNumeroInventaire))
            .collect(Collectors.toList());

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4.rotate(), 20, 20, 20, 20);
            PdfWriter.getInstance(doc, out);
            doc.open();

            Font labelFont = new Font(Font.HELVETICA, 9);

            doc.add(enteteEtablissement("REGISTRE MATIÈRE", ""));
            doc.add(new Paragraph(" ", labelFont));

            String[] cols = {
                "N°\nd'Inventaire",
                "Désignation\nde l'Objet",
                "Marque &\nN° de Série",
                "Date\nd'Entrée",
                "Mode\nd'Acquisition\n(Facture/Don)",
                "Prix d'Achat\n(DA)",
                "Affectation\n(Salle/Bureau)",
                "Date / Motif\nSortie"
            };
            float[] widths = {2.5f, 4f, 3.5f, 2.5f, 3.5f, 3f, 3.5f, 3.5f};
            PdfPTable table = tableAvecEntetes(cols, widths, 8f);
            Font cf = new Font(Font.HELVETICA, 8);

            int nb = 0;
            for (BienInventaire b : biens) {
                // Dernière sortie (REFORME ou TRANSFERT)
                String sortieDateMotif = "";
                if (b.getMouvements() != null) {
                    b.getMouvements().stream()
                        .filter(mv -> mv.getTypeMouvement() == TypeMouvement.REFORME
                                   || mv.getTypeMouvement() == TypeMouvement.TRANSFERT)
                        .max(Comparator.comparing(MouvementInventaire::getDateOperation))
                        .ifPresent(mv -> {});  // will build string below
                    sortieDateMotif = b.getMouvements().stream()
                        .filter(mv -> mv.getTypeMouvement() == TypeMouvement.REFORME
                                   || mv.getTypeMouvement() == TypeMouvement.TRANSFERT)
                        .max(Comparator.comparing(MouvementInventaire::getDateOperation))
                        .map(mv -> mv.getDateOperation().format(FMT) + "\n" + mv.getMotif())
                        .orElse("-");
                }

                table.addCell(cellule(b.getNumeroInventaire(), cf));
                table.addCell(cellule(b.getDesignation(), cf));
                table.addCell(cellule(b.getMarqueModele() != null ? b.getMarqueModele() : "", cf));
                table.addCell(cellule(b.getDateAcquisition() != null ? b.getDateAcquisition().format(FMT) : "", cf));
                // Mode d'acquisition : déduit du premier mouvement ou observations
                String modeAcq = b.getObservations() != null && b.getObservations().startsWith("Acq:")
                    ? b.getObservations().substring(4).trim() : "";
                table.addCell(cellule(modeAcq, cf));
                table.addCell(celluleRight(b.getPrixAchat() != null ? b.getPrixAchat().toPlainString() : "", cf));
                table.addCell(cellule(affLabel(b), cf));
                table.addCell(cellule(sortieDateMotif, cf));
                nb++;
            }
            for (int i = nb; i < Math.max(nb + 3, 10); i++) {
                for (int j = 0; j < cols.length; j++) table.addCell(celluleVide(cf, 16f));
            }
            doc.add(table);
            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur génération Registre Matière", e);
        }
    }

    // ─────────────────────────────────────────────────────────
    // 7 (C). REGISTRE GÉNÉRAL DES BIENS IMMOBILIERS — RGBI
    //        Colonnes : N° ordre | Désignation immeuble | Consistance |
    //                   Mode acquisition | Titre propriété/Affectation |
    //                   Valeur initiale (DA) | Observations
    // ─────────────────────────────────────────────────────────
    public byte[] registreBiensImmobiliers() {
        // Les biens immobiliers sont ceux dont les observations commencent par "IMMO:"
        // ou, en l'absence de marquage, on liste tous les biens actifs
        List<BienInventaire> biens = bienRepo.findAll().stream()
            .filter(b -> b.getStatut() == StatutBien.ACTIF)
            .sorted(Comparator.comparing(BienInventaire::getNumeroInventaire))
            .collect(Collectors.toList());

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4.rotate(), 20, 20, 20, 20);
            PdfWriter.getInstance(doc, out);
            doc.open();

            Font labelFont = new Font(Font.HELVETICA, 9);
            Font refFont  = new Font(Font.HELVETICA, 7);

            doc.add(enteteEtablissement("REGISTRE GÉNÉRAL DES BIENS IMMOBILIERS (RGBI)", ""));
            doc.add(new Paragraph(" ", labelFont));

            String[] cols = {
                "N°\nd'ordre",
                "Désignation\nde l'immeuble",
                "Consistance\n(Surface/Nombre\nde pièces)",
                "Mode\nd'acquisition",
                "Titre de propriété\n/ Affectation",
                "Valeur initiale\n(DA)",
                "Observations"
            };
            float[] widths = {1.5f, 4f, 4f, 3.5f, 4f, 3f, 4f};
            PdfPTable table = tableAvecEntetes(cols, widths, 8f);
            Font cf = new Font(Font.HELVETICA, 8);

            int nb = 0;
            for (BienInventaire b : biens) {
                table.addCell(celluleRight(String.valueOf(nb + 1), cf));
                table.addCell(cellule(b.getDesignation(), cf));
                // Consistance : extrait de marqueModele si disponible (ex: "500 m²")
                table.addCell(cellule(b.getMarqueModele() != null ? b.getMarqueModele() : "", cf));
                // Mode d'acquisition : déduit du premier mouvement entrant ou vide
                String modeAcq = b.getMouvements() != null && !b.getMouvements().isEmpty()
                    ? b.getMouvements().get(0).getMotif() : "";
                table.addCell(cellule(modeAcq, cf));
                table.addCell(cellule(affLabel(b), cf));
                table.addCell(celluleRight(b.getPrixAchat() != null ? b.getPrixAchat().toPlainString() : "", cf));
                table.addCell(cellule(b.getObservations() != null ? b.getObservations() : "", cf));
                nb++;
            }
            for (int i = nb; i < Math.max(nb + 3, 10); i++) {
                for (int j = 0; j < cols.length; j++) table.addCell(celluleVide(cf, 18f));
            }
            doc.add(table);
            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur génération RGBI", e);
        }
    }

    /** Traduit l'enum EtatMateriel en libellé français */
    private String etatLabel(EtatMateriel e) {
        if (e == null) return "";
        switch (e) {
            case BON: return "Bon";
            case MOYEN: return "Moyen";
            case HORS_SERVICE: return "Hors service";
            case EN_REPARATION: return "En réparation";
            default: return e.name();
        }
    }

    /** Retourne le libellé d'affectation d'un bien */
    private String affLabel(BienInventaire b) {
        if (b.getAffectation() != null) return b.getAffectation().getLibelle();
        if (b.getAffectationLibre() != null) return b.getAffectationLibre();
        return "";
    }

    // ─────────────────────────────────────────────────────────
    // 7. PROCÈS-VERBAL DE CESSION / TRANSFERT — MFP/IG/CMM/PV/C/T/07
    // ─────────────────────────────────────────────────────────
    public byte[] pvCessionTransfert(String directeur, String cfpDestination, List<Long> bienIds) {
        List<BienInventaire> biens = bienIds == null || bienIds.isEmpty()
            ? bienRepo.findAll().stream()
                .filter(b -> b.getStatut() == StatutBien.TRANSFERE)
                .collect(Collectors.toList())
            : bienIds.stream()
                .map(id -> bienRepo.findById(id).orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4, 30, 30, 30, 30);
            PdfWriter.getInstance(doc, out);
            doc.open();

            Font minFont  = new Font(Font.HELVETICA, 8, Font.BOLD);
            Font titreFont = new Font(Font.HELVETICA, 13, Font.BOLD);
            Font bodyFont = new Font(Font.HELVETICA, 9);
            Font refFont  = new Font(Font.HELVETICA, 7);

            // ── En-tête gauche / N° droite
            PdfPTable topRow = new PdfPTable(2);
            topRow.setWidthPercentage(100);
            topRow.setWidths(new float[]{70f, 30f});
            PdfPCell tLeft = new PdfPCell();
            tLeft.setBorder(Rectangle.NO_BORDER);
            tLeft.addElement(new Paragraph("MINISTERE DE LA FORMATION PROFESSIONNELLE", minFont));
            tLeft.addElement(new Paragraph("CENTRE DE FORMATION PROFESSIONNELLE", minFont));
            tLeft.addElement(new Paragraph("ET DE L'APPRENTISSAGE", minFont));
            tLeft.addElement(new Paragraph("___________________", refFont));
            topRow.addCell(tLeft);
            PdfPCell tRight = new PdfPCell();
            tRight.setBorder(Rectangle.NO_BORDER);
            tRight.setHorizontalAlignment(Element.ALIGN_RIGHT);
            tRight.addElement(new Paragraph("N° ___________________", bodyFont));
            topRow.addCell(tRight);
            doc.add(topRow);
            doc.add(new Paragraph(" ", bodyFont));

            // ── Titre
            PdfPTable titreTable = new PdfPTable(3);
            titreTable.setWidthPercentage(85);
            titreTable.setWidths(new float[]{40f, 35f, 25f});
            titreTable.setHorizontalAlignment(Element.ALIGN_CENTER);

            PdfPCell pvLabel = new PdfPCell(new Phrase("PROCES VERBAL DE", titreFont));
            pvLabel.setBorder(Rectangle.BOTTOM);
            pvLabel.setHorizontalAlignment(Element.ALIGN_CENTER);
            pvLabel.setVerticalAlignment(Element.ALIGN_MIDDLE);
            pvLabel.setPaddingBottom(4);
            titreTable.addCell(pvLabel);

            PdfPCell cessionCell = new PdfPCell();
            cessionCell.setBorder(Rectangle.NO_BORDER);
            cessionCell.addElement(new Paragraph("CESSION (1)", new Font(Font.HELVETICA, 10, Font.BOLD)));
            cessionCell.addElement(new Paragraph("TRANSFERT (1)", new Font(Font.HELVETICA, 10, Font.BOLD)));
            titreTable.addCell(cessionCell);

            PdfPCell deMatLabel = new PdfPCell(new Phrase("de matériel", bodyFont));
            deMatLabel.setBorder(Rectangle.NO_BORDER);
            deMatLabel.setVerticalAlignment(Element.ALIGN_MIDDLE);
            titreTable.addCell(deMatLabel);

            doc.add(titreTable);
            doc.add(new Paragraph(" ", bodyFont));
            doc.add(new Paragraph(" ", bodyFont));

            // ── Corps
            String dir = directeur != null ? directeur : "";
            String dest = cfpDestination != null ? cfpDestination : "";
            doc.add(new Paragraph("Nous soussigné M " + dir, bodyFont));
            doc.add(new Paragraph("Directeur du Centre de ________________________________", bodyFont));
            doc.add(new Paragraph(" ", refFont));
            doc.add(new Paragraph("Déclarons avoir cédé (1) ou transféré (1) au CFPde " + dest, bodyFont));
            doc.add(new Paragraph("________________________________ le matériel désigné ci après :", bodyFont));
            doc.add(new Paragraph(" ", refFont));

            // Ref
            Paragraph ref = new Paragraph("MFP/IG/CMM/PV/C/T/07", new Font(Font.HELVETICA, 7, Font.BOLD));
            ref.setAlignment(Element.ALIGN_RIGHT);
            doc.add(ref);

            // ── Tableau
            String[] cols = {"N°\nordre", "Date\nd'achat", "Désignation du matériel",
                             "Quantité", "Valeur\nd'achat", "N° de la\nfiche", "Observations"};
            float[] widths = {1.5f, 3f, 5f, 2f, 2.5f, 2.5f, 3.5f};
            PdfPTable table = tableAvecEntetes(cols, widths, 8f);
            Font cf = new Font(Font.HELVETICA, 8);

            int nb = 0;
            for (BienInventaire bien : biens) {
                table.addCell(celluleRight(String.valueOf(nb + 1), cf));
                table.addCell(cellule(bien.getDateAcquisition() != null ? bien.getDateAcquisition().format(FMT) : "", cf));
                table.addCell(cellule(bien.getDesignation(), cf));
                table.addCell(celluleRight("1", cf));
                table.addCell(celluleRight(bien.getPrixAchat() != null ? bien.getPrixAchat().toPlainString() : "", cf));
                table.addCell(cellule(bien.getNumeroInventaire() != null ? bien.getNumeroInventaire() : "", cf));
                table.addCell(cellule(bien.getObservations() != null ? bien.getObservations() : "", cf));
                nb++;
            }
            for (int i = nb; i < Math.max(nb + 3, 12); i++) {
                for (int j = 0; j < cols.length; j++) table.addCell(celluleVide(cf, 18f));
            }
            doc.add(table);
            doc.add(new Paragraph(" ", bodyFont));

            // ── Signatures
            PdfPTable sigs = new PdfPTable(2);
            sigs.setWidthPercentage(100);
            sigs.setWidths(new float[]{50f, 50f});
            PdfPCell sLeft = new PdfPCell();
            sLeft.setBorder(Rectangle.NO_BORDER);
            sLeft.addElement(new Paragraph("_______________ le ________", bodyFont));
            sLeft.addElement(new Paragraph("Le Directeur du CFPA", bodyFont));
            sLeft.addElement(new Paragraph("Bénéficiaire.", bodyFont));
            sigs.addCell(sLeft);
            PdfPCell sRight = new PdfPCell();
            sRight.setBorder(Rectangle.NO_BORDER);
            sRight.setHorizontalAlignment(Element.ALIGN_RIGHT);
            sRight.addElement(new Paragraph("_______________ le ________", bodyFont));
            sRight.addElement(new Paragraph("Le Directeur du CFPA ayant", bodyFont));
            sRight.addElement(new Paragraph("cédé ou transféré le matériel", bodyFont));
            sigs.addCell(sRight);
            doc.add(sigs);

            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur génération PV Cession/Transfert", e);
        }
    }

    // ─────────────────────────────────────────────────────────
    // 8. PROCÈS-VERBAL DE PERTE / VOL — MFP/IG/CMM/PVPV/08
    // ─────────────────────────────────────────────────────────
    public byte[] pvPerteVol(String directeur, String intendant, String magasinier,
                              String circonstances, List<Long> bienIds) {
        List<BienInventaire> biens = bienIds == null || bienIds.isEmpty()
            ? Collections.emptyList()
            : bienIds.stream()
                .map(id -> bienRepo.findById(id).orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4, 30, 30, 30, 30);
            PdfWriter.getInstance(doc, out);
            doc.open();

            Font minFont  = new Font(Font.HELVETICA, 8, Font.BOLD);
            Font titreFont = new Font(Font.HELVETICA, 13, Font.BOLD);
            Font bodyFont = new Font(Font.HELVETICA, 9);
            Font refFont  = new Font(Font.HELVETICA, 7);

            // ── En-tête
            Paragraph entete = new Paragraph("CENTRE DE FORMATION PROFESSIONNELLE ET DE L'APPRENTISSAGE", minFont);
            doc.add(entete);
            doc.add(new Paragraph("___________________", refFont));
            doc.add(new Paragraph(" ", refFont));

            // ── Titre
            Paragraph titre = new Paragraph("PROCES VERBAL", titreFont);
            titre.setAlignment(Element.ALIGN_CENTER);
            doc.add(titre);

            PdfPTable titreRow = new PdfPTable(3);
            titreRow.setWidthPercentage(60);
            titreRow.setHorizontalAlignment(Element.ALIGN_CENTER);
            titreRow.setWidths(new float[]{30f, 15f, 55f});
            PdfPCell blank = new PdfPCell(new Phrase(" ", bodyFont));
            blank.setBorder(Rectangle.NO_BORDER);
            titreRow.addCell(blank);
            PdfPCell deCell = new PdfPCell(new Phrase("de", bodyFont));
            deCell.setBorder(Rectangle.NO_BORDER);
            deCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            titreRow.addCell(deCell);
            PdfPCell pvCell = new PdfPCell();
            pvCell.setBorder(Rectangle.NO_BORDER);
            pvCell.addElement(new Paragraph("Perte (1)", new Font(Font.HELVETICA, 10, Font.BOLD)));
            pvCell.addElement(new Paragraph("Vol (1)", new Font(Font.HELVETICA, 10, Font.BOLD)));
            titreRow.addCell(pvCell);
            doc.add(titreRow);
            doc.add(new Paragraph(" ", bodyFont));
            doc.add(new Paragraph(" ", bodyFont));

            // ── Corps
            String dir = directeur != null ? directeur : "";
            String intd = intendant != null ? intendant : "";
            String mag  = magasinier != null ? magasinier : "";
            String circ = circonstances != null ? circonstances : "";

            doc.add(new Paragraph("Nous soussigné Monsieur " + dir, bodyFont));
            doc.add(new Paragraph("Directeur de Centre _____________ assisté de Messieurs " + intd, bodyFont));
            doc.add(new Paragraph("Intendant.et " + mag + " Magasinier.", bodyFont));
            doc.add(new Paragraph(" ", refFont));
            doc.add(new Paragraph("certifions que les objets, articles, ci-dessus désignés ont été Volés (1)", bodyFont));
            doc.add(new Paragraph("Perdus (1) dans les circonstances suivantes :", bodyFont));
            doc.add(new Paragraph(circ.isEmpty() ? "________________________________________________" : circ, bodyFont));
            doc.add(new Paragraph("(en cas de vol joindre le constat des autorités de polices compétentes)", refFont));

            // Ref
            Paragraph ref = new Paragraph("MFP/IG/CMM/PVPV/08", new Font(Font.HELVETICA, 7, Font.BOLD));
            ref.setAlignment(Element.ALIGN_RIGHT);
            doc.add(ref);

            // ── Tableau
            String[] cols = {"N°\nd'ordre", "Désignation des articles",
                             "Numéro au Registre\nd'inventaire",
                             "Quantité", "Prix\nUnitaire", "Observations"};
            float[] widths = {1.5f, 5f, 3.5f, 2f, 2.5f, 3.5f};
            PdfPTable table = tableAvecEntetes(cols, widths, 8f);
            Font cf = new Font(Font.HELVETICA, 8);

            int nb = 0;
            for (BienInventaire bien : biens) {
                table.addCell(celluleRight(String.valueOf(nb + 1), cf));
                table.addCell(cellule(bien.getDesignation(), cf));
                table.addCell(cellule(bien.getNumeroInventaire() != null ? bien.getNumeroInventaire() : "", cf));
                table.addCell(celluleRight("1", cf));
                table.addCell(celluleRight(bien.getPrixAchat() != null ? bien.getPrixAchat().toPlainString() : "", cf));
                table.addCell(cellule("", cf));
                nb++;
            }
            for (int i = nb; i < Math.max(nb + 3, 12); i++) {
                for (int j = 0; j < cols.length; j++) table.addCell(celluleVide(cf, 18f));
            }
            doc.add(table);
            doc.add(new Paragraph(" ", bodyFont));

            // ── Signatures
            PdfPTable sigs = new PdfPTable(3);
            sigs.setWidthPercentage(100);
            sigs.setWidths(new float[]{30f, 30f, 40f});
            sigs.addCell(celluleSig("Le magasinier"));
            sigs.addCell(celluleSig("L'intendant"));
            PdfPCell sDroit = new PdfPCell();
            sDroit.setBorder(Rectangle.NO_BORDER);
            sDroit.setHorizontalAlignment(Element.ALIGN_CENTER);
            sDroit.addElement(new Paragraph("Dressé à ___________ le ________", bodyFont));
            sDroit.addElement(new Paragraph(" ", refFont));
            sDroit.addElement(new Paragraph("Le Directeur de l'établissement", bodyFont));
            sigs.addCell(sDroit);
            doc.add(sigs);

            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur génération PV Perte/Vol", e);
        }
    }

    // ─────────────────────────────────────────────────────────
    // 9. PROCÈS-VERBAL DE RÉFORME — MFP/IG/CMM/PVR/10
    // ─────────────────────────────────────────────────────────
    public byte[] pvReforme(String directeur, String cfpa, String intendant, String magasinier) {
        List<BienInventaire> biens = bienRepo.findAll().stream()
            .filter(b -> b.getStatut() == StatutBien.REFORME)
            .sorted(Comparator.comparing(BienInventaire::getDesignation))
            .collect(Collectors.toList());

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4, 30, 30, 30, 30);
            PdfWriter.getInstance(doc, out);
            doc.open();

            Font minFont  = new Font(Font.HELVETICA, 8, Font.BOLD);
            Font titreFont = new Font(Font.HELVETICA, 13, Font.BOLD);
            Font bodyFont = new Font(Font.HELVETICA, 9);
            Font refFont  = new Font(Font.HELVETICA, 7);

            // ── En-tête
            doc.add(new Paragraph("MINISTERE DE LA FORMATION PROFESSIONNELLE", minFont));
            doc.add(new Paragraph("CENTRE DE FORMATION PROFESSIONNELLE", minFont));
            doc.add(new Paragraph("ET DE L'APPRENTISSAGE", minFont));
            doc.add(new Paragraph("___________________", refFont));
            doc.add(new Paragraph(" ", refFont));

            // ── Titre
            Paragraph titre = new Paragraph("PROCES VERBAL DE REFORME", titreFont);
            titre.setAlignment(Element.ALIGN_CENTER);
            doc.add(titre);
            doc.add(new Paragraph(" ", bodyFont));
            doc.add(new Paragraph(" ", bodyFont));

            // ── Corps
            String dir  = directeur != null ? directeur : "";
            String cfp  = cfpa != null ? cfpa : "";
            String intd = intendant != null ? intendant : "";
            String mag  = magasinier != null ? magasinier : "";

            doc.add(new Paragraph("Nous soussigné M " + dir, bodyFont));
            doc.add(new Paragraph("Directeur du CFPA de " + cfp + " assisté de :", bodyFont));
            doc.add(new Paragraph("MM " + intd + " Intendant et de ___________________", bodyFont));
            doc.add(new Paragraph(mag + " Magasinier.", bodyFont));
            doc.add(new Paragraph("Déclarons que les articles, ci-dessous désignés, sont proposés à la réforme.", bodyFont));
            doc.add(new Paragraph(" ", refFont));

            // Ref
            Paragraph ref = new Paragraph("MFP/IG/CMM/PVR/10", new Font(Font.HELVETICA, 7, Font.BOLD));
            ref.setAlignment(Element.ALIGN_RIGHT);
            doc.add(ref);

            // ── Tableau avec sous-colonne Prix
            String[] cols = {"N°", "Désignation des Articles", "Quantités",
                             "N° inventaire\nR.I.", "Prix unitaire\nd'Achat", "Total", "Observation"};
            float[] widths = {1.5f, 5f, 2f, 3f, 3f, 2.5f, 3f};
            PdfPTable table = tableAvecEntetes(cols, widths, 8f);
            Font cf = new Font(Font.HELVETICA, 8);

            int nb = 0;
            for (BienInventaire bien : biens) {
                String prixStr = bien.getPrixAchat() != null ? bien.getPrixAchat().toPlainString() : "";
                table.addCell(celluleRight(String.valueOf(nb + 1), cf));
                table.addCell(cellule(bien.getDesignation(), cf));
                table.addCell(celluleRight("1", cf));
                table.addCell(cellule(bien.getNumeroInventaire() != null ? bien.getNumeroInventaire() : "", cf));
                table.addCell(celluleRight(prixStr, cf));
                table.addCell(celluleRight(prixStr, cf)); // total = 1 × prix unitaire
                table.addCell(cellule(bien.getObservations() != null ? bien.getObservations() : "", cf));
                nb++;
            }
            for (int i = nb; i < Math.max(nb + 3, 12); i++) {
                for (int j = 0; j < cols.length; j++) table.addCell(celluleVide(cf, 18f));
            }
            doc.add(table);
            doc.add(new Paragraph(" ", bodyFont));

            // ── Signatures
            PdfPTable sigs = new PdfPTable(4);
            sigs.setWidthPercentage(100);
            sigs.setWidths(new float[]{28f, 24f, 24f, 24f});

            PdfPCell sReforme = new PdfPCell();
            sReforme.setBorder(Rectangle.NO_BORDER);
            sReforme.addElement(new Paragraph("Réforme prononcée le ___________", bodyFont));
            sReforme.addElement(new Paragraph("le sous-Directeur des Affaires Domaniales", bodyFont));
            sigs.addCell(sReforme);

            PdfPCell sFait = new PdfPCell();
            sFait.setBorder(Rectangle.NO_BORDER);
            sFait.addElement(new Paragraph("Fait à __________ le _____", bodyFont));
            sigs.addCell(sFait);

            sigs.addCell(celluleSig("Le Magasinier"));
            sigs.addCell(celluleSig("L'Intendant"));

            doc.add(sigs);

            // Directeur séparé en dessous
            PdfPTable sigDir = new PdfPTable(1);
            sigDir.setWidthPercentage(50);
            sigDir.setHorizontalAlignment(Element.ALIGN_RIGHT);
            PdfPCell cDir = new PdfPCell();
            cDir.setBorder(Rectangle.NO_BORDER);
            cDir.setHorizontalAlignment(Element.ALIGN_CENTER);
            cDir.addElement(new Paragraph("Le Directeur du Centre", bodyFont));
            sigDir.addCell(cDir);
            doc.add(sigDir);

            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur génération PV Réforme", e);
        }
    }

    private PdfPTable visasEJS() throws DocumentException {
        Font f = new Font(Font.HELVETICA, 8);
        Font fb = new Font(Font.HELVETICA, 8, Font.BOLD);
        PdfPTable visas = new PdfPTable(4);
        visas.setWidthPercentage(100);
        visas.setWidths(new float[]{25f, 25f, 25f, 25f});

        PdfPCell titre = new PdfPCell(new Phrase("- VISAS -", fb));
        titre.setColspan(4);
        titre.setHorizontalAlignment(Element.ALIGN_CENTER);
        titre.setBorder(Rectangle.TOP | Rectangle.LEFT | Rectangle.RIGHT);
        visas.addCell(titre);

        PdfPCell m = new PdfPCell(); m.setPadding(4); m.setBorder(Rectangle.BOX);
        m.addElement(new Paragraph("MAGASIN", fb));
        m.addElement(new Paragraph("Etabli le : ___________", f));
        visas.addCell(m);

        PdfPCell cm = new PdfPCell(); cm.setPadding(4); cm.setBorder(Rectangle.BOX);
        cm.addElement(new Paragraph("Comptabilité Matière", fb));
        cm.addElement(new Paragraph("Reporté S/R le : ___________", f));
        visas.addCell(cm);

        PdfPCell intend = new PdfPCell(); intend.setPadding(4); intend.setBorder(Rectangle.BOX);
        intend.addElement(new Paragraph("L'Intendant", fb));
        intend.addElement(new Paragraph("Visé le : ___________", f));
        visas.addCell(intend);

        PdfPCell dir = new PdfPCell(); dir.setPadding(4); dir.setBorder(Rectangle.BOX);
        dir.addElement(new Paragraph("Le Directeur du Centre", fb));
        dir.addElement(new Paragraph("Visé le : ___________", f));
        visas.addCell(dir);

        return visas;
    }

    // ─────────────────────────────────────────────────────────
    // HELPER : en-tête officielle établissement (3 colonnes)
    // ─────────────────────────────────────────────────────────
    private PdfPTable enteteEtablissement(String titre, String reference) throws DocumentException {
        Font minFont   = new Font(Font.HELVETICA, 7, Font.BOLD);
        Font titreFont = new Font(Font.HELVETICA, 12, Font.BOLD);
        Font refFont   = new Font(Font.HELVETICA, 7);

        PdfPTable header = new PdfPTable(3);
        header.setWidthPercentage(100);
        header.setWidths(new float[]{28f, 44f, 28f});

        PdfPCell gauche = new PdfPCell();
        gauche.setBorder(Rectangle.NO_BORDER);
        gauche.addElement(new Paragraph("MINISTERE DE LA FORMATION PROFESSIONNELLE", minFont));
        gauche.addElement(new Paragraph(" ", refFont));
        gauche.addElement(new Paragraph(ETABLISSEMENT, minFont));
        gauche.addElement(new Paragraph(" ", refFont));
        gauche.addElement(new Paragraph("DE ___________________", refFont));
        header.addCell(gauche);

        PdfPCell centre = new PdfPCell();
        centre.setBorder(Rectangle.NO_BORDER);
        centre.setHorizontalAlignment(Element.ALIGN_CENTER);
        centre.setVerticalAlignment(Element.ALIGN_MIDDLE);
        Paragraph titrePara = new Paragraph(titre, titreFont);
        titrePara.setAlignment(Element.ALIGN_CENTER);
        centre.addElement(titrePara);
        header.addCell(centre);

        PdfPCell droite = new PdfPCell();
        droite.setBorder(Rectangle.NO_BORDER);
        droite.setHorizontalAlignment(Element.ALIGN_RIGHT);
        if (reference != null && !reference.isEmpty()) {
            droite.addElement(new Paragraph(reference, new Font(Font.HELVETICA, 7, Font.BOLD)));
        }
        header.addCell(droite);

        return header;
    }
}
