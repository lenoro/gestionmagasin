package com.gestionmagasin.service;

import com.gestionmagasin.dto.ArticleBesoinDto;
import com.gestionmagasin.dto.LigneConsommationDto;
import com.gestionmagasin.model.*;
import com.gestionmagasin.repository.*;
import com.lowagie.text.Chunk;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RgbiRapportService {

    private final BonSortieRepository bonSortieRepo;
    private final BonEntreeRepository bonEntreeRepo;
    private final ArticleRepository articleRepo;
    private final BienInventaireRepository bienInventaireRepo;

    public RgbiRapportService(BonSortieRepository bonSortieRepo,
                               BonEntreeRepository bonEntreeRepo,
                               ArticleRepository articleRepo,
                               BienInventaireRepository bienInventaireRepo) {
        this.bonSortieRepo = bonSortieRepo;
        this.bonEntreeRepo = bonEntreeRepo;
        this.articleRepo = articleRepo;
        this.bienInventaireRepo = bienInventaireRepo;
    }

    // ── 1. Registre de Consommation ──────────────────────────────────
    public List<LigneConsommationDto> getConsommation(LocalDate debut, LocalDate fin,
                                                       Long affectationId, Long consommateurId) {
        List<BonSortie> bons = bonSortieRepo.findAll().stream()
            .filter(b -> b.getStatut() == StatutBonSortie.TRAITE)
            .filter(b -> debut == null || !b.getDateBon().isBefore(debut))
            .filter(b -> fin == null   || !b.getDateBon().isAfter(fin))
            .filter(b -> affectationId == null || (b.getServiceDestination() != null
                         && b.getServiceDestination().getId().equals(affectationId)))
            .filter(b -> consommateurId == null || (b.getConsommateur() != null
                         && b.getConsommateur().getId().equals(consommateurId)))
            .collect(Collectors.toList());

        Map<Long, List<LigneBonSortie>> byArticle = new LinkedHashMap<>();
        for (BonSortie bon : bons) {
            for (LigneBonSortie ligne : bon.getLignes()) {
                byArticle.computeIfAbsent(ligne.getArticle().getId(), k -> new ArrayList<>()).add(ligne);
            }
        }

        List<LigneConsommationDto> result = new ArrayList<>();
        for (Map.Entry<Long, List<LigneBonSortie>> entry : byArticle.entrySet()) {
            List<LigneBonSortie> lignes = entry.getValue();
            Article art = lignes.get(0).getArticle();
            int qte = lignes.stream().mapToInt(LigneBonSortie::getQuantite).sum();
            String services = lignes.stream()
                .map(l -> l.getBon().getServiceDestination() != null
                    ? l.getBon().getServiceDestination().getLibelle() : "—")
                .distinct().collect(Collectors.joining(", "));
            String consommateurs = lignes.stream()
                .map(l -> l.getBon().getConsommateur() != null
                    ? l.getBon().getConsommateur().getNomPrenom() : "—")
                .distinct().collect(Collectors.joining(", "));
            result.add(new LigneConsommationDto(
                art.getArticleCode(), art.getArticleName(),
                art.getNumNomenclature() != null ? art.getNumNomenclature() : "—",
                art.getUnitesMesure() != null ? art.getUnitesMesure() : "—",
                qte, services, consommateurs));
        }
        return result;
    }

    // ── 2. État des Besoins ──────────────────────────────────────────
    public List<ArticleBesoinDto> getBesoins() {
        return articleRepo.findAlertes().stream()
            .map(a -> new ArticleBesoinDto(
                a.getArticleCode(), a.getArticleName(),
                a.getNumNomenclature() != null ? a.getNumNomenclature() : "—",
                a.getUnitesMesure() != null ? a.getUnitesMesure() : "—",
                a.getStock(),
                a.getStockMinimum() != null ? a.getStockMinimum() : 0))
            .sorted(Comparator.comparingDouble(ArticleBesoinDto::getStockActuel))
            .collect(Collectors.toList());
    }

    // ── 3. Grand Livre d'Inventaire ──────────────────────────────────
    public List<BienInventaire> getGrandLivre(LocalDate debut, LocalDate fin) {
        return bienInventaireRepo.findAll().stream()
            .filter(b -> debut == null || !b.getDateAcquisition().isBefore(debut))
            .filter(b -> fin == null   || !b.getDateAcquisition().isAfter(fin))
            .sorted(Comparator.comparing(BienInventaire::getNumeroInventaire))
            .collect(Collectors.toList());
    }

    // ── 4. Fiche de Bien ─────────────────────────────────────────────
    public BienInventaire getFicheBien(Long id) {
        return bienInventaireRepo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Bien introuvable : " + id));
    }

    // ── 5. Registre des Entrées ──────────────────────────────────────
    public List<BonEntree> getEntrees(LocalDate debut, LocalDate fin, Long fournisseurId) {
        return bonEntreeRepo.findAll().stream()
            .filter(b -> b.getStatut() == StatutBonEntree.VALIDE)
            .filter(b -> debut == null       || !b.getDateBon().isBefore(debut))
            .filter(b -> fin == null         || !b.getDateBon().isAfter(fin))
            .filter(b -> fournisseurId == null || (b.getFournisseur() != null
                         && b.getFournisseur().getId().equals(fournisseurId)))
            .sorted(Comparator.comparing(BonEntree::getDateBon))
            .collect(Collectors.toList());
    }

    // ── 6. Registre des Sorties ──────────────────────────────────────
    public List<BonSortie> getSorties(LocalDate debut, LocalDate fin,
                                       Long affectationId, Long consommateurId) {
        return bonSortieRepo.findAll().stream()
            .filter(b -> b.getStatut() == StatutBonSortie.TRAITE)
            .filter(b -> debut == null       || !b.getDateBon().isBefore(debut))
            .filter(b -> fin == null         || !b.getDateBon().isAfter(fin))
            .filter(b -> affectationId == null || (b.getServiceDestination() != null
                         && b.getServiceDestination().getId().equals(affectationId)))
            .filter(b -> consommateurId == null || (b.getConsommateur() != null
                         && b.getConsommateur().getId().equals(consommateurId)))
            .sorted(Comparator.comparing(BonSortie::getDateBon))
            .collect(Collectors.toList());
    }

    // ── 7. Bordereau de Transmission ─────────────────────────────────
    public BonSortie getBordereau(Long bonSortieId) {
        return bonSortieRepo.findById(bonSortieId)
            .orElseThrow(() -> new IllegalArgumentException("Bon de sortie introuvable : " + bonSortieId));
    }

    // ── PDF 1 : Registre de Consommation ─────────────────────────────
    public byte[] pdfConsommation(List<LigneConsommationDto> lignes) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(doc, out);
            doc.open();
            doc.add(titreDoc("REGISTRE DE CONSOMMATION DES FOURNITURES"));
            doc.add(new Paragraph(" "));
            String[] cols = {"Code", "Désignation", "N° Nomencl.", "Unité", "Qté totale", "Service(s)", "Demandeur(s)"};
            float[] widths = {1.5f, 3f, 2f, 1.2f, 1.5f, 2.5f, 2.5f};
            PdfPTable table = tableAvecEntetes(cols, widths);
            Font cf = new Font(Font.HELVETICA, 8);
            for (LigneConsommationDto l : lignes) {
                table.addCell(new Phrase(l.getArticleCode(), cf));
                table.addCell(new Phrase(l.getArticleName(), cf));
                table.addCell(new Phrase(l.getNumNomenclature(), cf));
                table.addCell(new Phrase(l.getUnitesMesure(), cf));
                table.addCell(new Phrase(String.valueOf(l.getQteTotal()), cf));
                table.addCell(new Phrase(l.getServices(), cf));
                table.addCell(new Phrase(l.getConsommateurs(), cf));
            }
            if (lignes.isEmpty()) {
                PdfPCell empty = new PdfPCell(new Phrase("Aucune donnée pour ces filtres", cf));
                empty.setColspan(7);
                empty.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(empty);
            }
            doc.add(table);
            doc.close();
            return out.toByteArray();
        } catch (Exception e) { throw new RuntimeException("Erreur PDF consommation", e); }
    }

    // ── PDF 2 : État des Besoins ──────────────────────────────────────
    public byte[] pdfBesoins(List<ArticleBesoinDto> articles) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4);
            PdfWriter.getInstance(doc, out);
            doc.open();
            doc.add(titreDoc("ÉTAT DES BESOINS EN FOURNITURES"));
            doc.add(new Paragraph("Date : " + LocalDate.now(), new Font(Font.HELVETICA, 9)));
            doc.add(new Paragraph(" "));
            String[] cols = {"Code", "Désignation", "N° Nomencl.", "Stock actuel", "Seuil min", "Qté à commander", "Unité"};
            float[] widths = {1.5f, 3f, 2f, 1.8f, 1.5f, 2.2f, 1.2f};
            PdfPTable table = tableAvecEntetes(cols, widths);
            Font cf = new Font(Font.HELVETICA, 8);
            for (ArticleBesoinDto a : articles) {
                Font rowFont = a.getStockActuel() == 0
                    ? new Font(Font.HELVETICA, 8, Font.BOLD, Color.RED)
                    : cf;
                table.addCell(new Phrase(a.getArticleCode(), rowFont));
                table.addCell(new Phrase(a.getArticleName(), rowFont));
                table.addCell(new Phrase(a.getNumNomenclature(), rowFont));
                table.addCell(new Phrase(String.valueOf(a.getStockActuel()), rowFont));
                table.addCell(new Phrase(String.valueOf(a.getStockMinimum()), rowFont));
                table.addCell(new Phrase(String.valueOf(a.getQteACommander()), rowFont));
                table.addCell(new Phrase(a.getUnitesMesure(), rowFont));
            }
            if (articles.isEmpty()) {
                PdfPCell empty = new PdfPCell(new Phrase("Aucun article sous le seuil minimum", cf));
                empty.setColspan(7);
                empty.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(empty);
            }
            doc.add(table);
            doc.close();
            return out.toByteArray();
        } catch (Exception e) { throw new RuntimeException("Erreur PDF besoins", e); }
    }

    // ── PDF 3 : Grand Livre d'Inventaire ─────────────────────────────
    public byte[] pdfGrandLivre(List<BienInventaire> biens) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(doc, out);
            doc.open();
            doc.add(titreDoc("GRAND LIVRE D'INVENTAIRE DES BIENS NON-CONSOMPTIBLES"));
            doc.add(new Paragraph(" "));
            String[] cols = {"N° Inventaire", "Désignation", "Marque/Modèle", "Date acq.", "Prix (DA)", "État", "Statut", "Affectation"};
            float[] widths = {2f, 3f, 2f, 1.8f, 2f, 1.5f, 1.5f, 2.5f};
            PdfPTable table = tableAvecEntetes(cols, widths);
            Font cf = new Font(Font.HELVETICA, 8);
            for (BienInventaire b : biens) {
                String aff = b.getAffectation() != null ? b.getAffectation().getLibelle()
                           : b.getAffectationLibre() != null ? b.getAffectationLibre() : "—";
                table.addCell(new Phrase(b.getNumeroInventaire(), cf));
                table.addCell(new Phrase(b.getDesignation(), cf));
                table.addCell(new Phrase(b.getMarqueModele() != null ? b.getMarqueModele() : "—", cf));
                table.addCell(new Phrase(b.getDateAcquisition().toString(), cf));
                table.addCell(new Phrase(b.getPrixAchat().toPlainString(), cf));
                table.addCell(new Phrase(b.getEtatMateriel().name(), cf));
                table.addCell(new Phrase(b.getStatut().name(), cf));
                table.addCell(new Phrase(aff, cf));
            }
            if (biens.isEmpty()) {
                PdfPCell empty = new PdfPCell(new Phrase("Aucun bien pour cette période", cf));
                empty.setColspan(8);
                empty.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(empty);
            }
            doc.add(table);
            doc.close();
            return out.toByteArray();
        } catch (Exception e) { throw new RuntimeException("Erreur PDF grand livre", e); }
    }

    // ── PDF 4 : Fiche de Bien ─────────────────────────────────────────
    public byte[] pdfFicheBien(BienInventaire b) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4);
            PdfWriter.getInstance(doc, out);
            doc.open();
            doc.add(titreDoc("FICHE DE BIEN INVENTORIÉ"));
            doc.add(new Paragraph(" "));
            Font label = new Font(Font.HELVETICA, 10, Font.BOLD);
            Font val   = new Font(Font.HELVETICA, 10);
            String aff = b.getAffectation() != null ? b.getAffectation().getLibelle()
                       : b.getAffectationLibre() != null ? b.getAffectationLibre() : "—";
            doc.add(champ("N° Inventaire", b.getNumeroInventaire(), label, val));
            doc.add(champ("Désignation", b.getDesignation(), label, val));
            doc.add(champ("Marque / Modèle", b.getMarqueModele() != null ? b.getMarqueModele() : "—", label, val));
            doc.add(champ("Date d'acquisition", b.getDateAcquisition().toString(), label, val));
            doc.add(champ("Prix d'achat", b.getPrixAchat().toPlainString() + " DA", label, val));
            doc.add(champ("État", b.getEtatMateriel().name(), label, val));
            doc.add(champ("Statut", b.getStatut().name(), label, val));
            doc.add(champ("Affectation", aff, label, val));
            if (b.getObservations() != null) {
                doc.add(champ("Observations", b.getObservations(), label, val));
            }
            doc.add(new Paragraph(" "));
            doc.add(new Paragraph(" "));
            PdfPTable sig = new PdfPTable(2);
            sig.setWidthPercentage(80);
            Font sf = new Font(Font.HELVETICA, 9);
            sig.addCell(cellSig("Signature Intendant", sf));
            sig.addCell(cellSig("Cachet de l'établissement", sf));
            doc.add(sig);
            doc.close();
            return out.toByteArray();
        } catch (Exception e) { throw new RuntimeException("Erreur PDF fiche bien", e); }
    }

    // ── PDF 5 : Registre des Entrées ─────────────────────────────────
    public byte[] pdfEntrees(List<BonEntree> bons) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(doc, out);
            doc.open();
            doc.add(titreDoc("REGISTRE DES BONS D'ENTRÉE"));
            doc.add(new Paragraph(" "));
            String[] cols = {"N° Bon", "Date", "Type", "Fournisseur / Source", "Nb articles", "Montant total (DA)", "Visa"};
            float[] widths = {2.5f, 1.8f, 2.5f, 3f, 1.5f, 2.5f, 1.5f};
            PdfPTable table = tableAvecEntetes(cols, widths);
            Font cf = new Font(Font.HELVETICA, 8);
            for (BonEntree b : bons) {
                String src = b.getFournisseur() != null ? b.getFournisseur().getRaisonSociale()
                           : b.getServiceSource() != null ? b.getServiceSource().getLibelle() : "—";
                double total = b.getLignes().stream()
                    .mapToDouble(l -> l.getPrixUnitaire().doubleValue() * l.getQuantite()).sum();
                table.addCell(new Phrase(b.getNumeroBon(), cf));
                table.addCell(new Phrase(b.getDateBon().toString(), cf));
                table.addCell(new Phrase(b.getTypeBon().name().replace("_", " "), cf));
                table.addCell(new Phrase(src, cf));
                table.addCell(new Phrase(String.valueOf(b.getLignes().size()), cf));
                table.addCell(new Phrase(String.format("%.2f", total), cf));
                table.addCell(new Phrase(b.getVisa() != null ? b.getVisa() : "—", cf));
            }
            if (bons.isEmpty()) {
                PdfPCell empty = new PdfPCell(new Phrase("Aucun bon d'entrée validé pour ces filtres", cf));
                empty.setColspan(7); empty.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(empty);
            }
            doc.add(table);
            doc.close();
            return out.toByteArray();
        } catch (Exception e) { throw new RuntimeException("Erreur PDF entrées", e); }
    }

    // ── PDF 6 : Registre des Sorties ─────────────────────────────────
    public byte[] pdfSorties(List<BonSortie> bons) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(doc, out);
            doc.open();
            doc.add(titreDoc("REGISTRE DES BONS DE SORTIE"));
            doc.add(new Paragraph(" "));
            String[] cols = {"N° Bon", "Date", "Service dest.", "Demandeur", "Type sortie", "Nb articles", "Visa magasin.", "Visa approbat."};
            float[] widths = {2f, 1.8f, 2.5f, 2.5f, 2f, 1.5f, 2f, 2f};
            PdfPTable table = tableAvecEntetes(cols, widths);
            Font cf = new Font(Font.HELVETICA, 8);
            for (BonSortie b : bons) {
                table.addCell(new Phrase(b.getNumeroBon(), cf));
                table.addCell(new Phrase(b.getDateBon().toString(), cf));
                table.addCell(new Phrase(b.getServiceDestination() != null ? b.getServiceDestination().getLibelle() : "—", cf));
                table.addCell(new Phrase(b.getConsommateur() != null ? b.getConsommateur().getNomPrenom() : "—", cf));
                table.addCell(new Phrase(b.getTypeSortie() != null ? b.getTypeSortie().name().replace("_", " ") : "—", cf));
                table.addCell(new Phrase(String.valueOf(b.getLignes().size()), cf));
                table.addCell(new Phrase(b.getVisaMagasinier() != null ? b.getVisaMagasinier() : "—", cf));
                table.addCell(new Phrase(b.getVisaApprobateur() != null ? b.getVisaApprobateur() : "—", cf));
            }
            if (bons.isEmpty()) {
                PdfPCell empty = new PdfPCell(new Phrase("Aucun bon de sortie traité pour ces filtres", cf));
                empty.setColspan(8); empty.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(empty);
            }
            doc.add(table);
            doc.close();
            return out.toByteArray();
        } catch (Exception e) { throw new RuntimeException("Erreur PDF sorties", e); }
    }

    // ── PDF 7 : Bordereau de Transmission ────────────────────────────
    public byte[] pdfBordereau(BonSortie bon) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4);
            PdfWriter.getInstance(doc, out);
            doc.open();
            Font titre = new Font(Font.HELVETICA, 14, Font.BOLD);
            Font label = new Font(Font.HELVETICA, 10, Font.BOLD);
            Font val   = new Font(Font.HELVETICA, 10);
            Font small = new Font(Font.HELVETICA, 8);
            Paragraph h = new Paragraph("BORDEREAU DE TRANSMISSION", titre);
            h.setAlignment(Element.ALIGN_CENTER);
            doc.add(h);
            doc.add(new Paragraph(" "));
            doc.add(champ("N° Bon de sortie", bon.getNumeroBon(), label, val));
            doc.add(champ("Date", bon.getDateBon().toString(), label, val));
            doc.add(champ("Service émetteur", "Magasin CFPA", label, val));
            doc.add(champ("Service récepteur",
                bon.getServiceDestination() != null ? bon.getServiceDestination().getLibelle() : "—", label, val));
            if (bon.getConsommateur() != null) {
                doc.add(champ("Demandeur", bon.getConsommateur().getNomPrenom(), label, val));
            }
            doc.add(new Paragraph(" "));
            String[] cols = {"Désignation", "Qté", "Unité", "Observations"};
            float[] widths = {5f, 1.5f, 2f, 4f};
            PdfPTable table = tableAvecEntetes(cols, widths);
            for (LigneBonSortie ligne : bon.getLignes()) {
                table.addCell(new Phrase(ligne.getArticle().getArticleName(), small));
                table.addCell(new Phrase(String.valueOf(ligne.getQuantite()), small));
                table.addCell(new Phrase(
                    ligne.getArticle().getUnitesMesure() != null ? ligne.getArticle().getUnitesMesure() : "—", small));
                table.addCell(new Phrase("", small));
            }
            doc.add(table);
            doc.add(new Paragraph(" "));
            doc.add(new Paragraph(" "));
            PdfPTable sig = new PdfPTable(3);
            sig.setWidthPercentage(100);
            sig.addCell(cellSig("Le Demandeur\n\n\n" + (bon.getVisaDemandeur() != null ? bon.getVisaDemandeur() : ""), val));
            sig.addCell(cellSig("Le Magasinier\n\n\n" + (bon.getVisaMagasinier() != null ? bon.getVisaMagasinier() : ""), val));
            sig.addCell(cellSig("L'Intendant / Approbateur\n\n\n" + (bon.getVisaApprobateur() != null ? bon.getVisaApprobateur() : ""), val));
            doc.add(sig);
            doc.close();
            return out.toByteArray();
        } catch (Exception e) { throw new RuntimeException("Erreur PDF bordereau", e); }
    }

    // ── Excel helpers ─────────────────────────────────────────────────
    private CellStyle headerStyle(XSSFWorkbook wb) {
        CellStyle s = wb.createCellStyle();
        org.apache.poi.ss.usermodel.Font f = wb.createFont();
        f.setBold(true);
        s.setFont(f);
        s.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
        s.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        return s;
    }

    private Row headerRow(Sheet sheet, CellStyle style, String... cols) {
        Row row = sheet.createRow(0);
        for (int i = 0; i < cols.length; i++) {
            Cell c = row.createCell(i);
            c.setCellValue(cols[i]);
            c.setCellStyle(style);
        }
        return row;
    }

    public byte[] excelConsommation(List<LigneConsommationDto> lignes) {
        try (XSSFWorkbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("Consommation");
            CellStyle hs = headerStyle(wb);
            headerRow(sheet, hs, "Code", "Désignation", "N° Nomenclature", "Unité", "Qté totale", "Service(s)", "Demandeur(s)");
            int r = 1;
            for (LigneConsommationDto l : lignes) {
                Row row = sheet.createRow(r++);
                row.createCell(0).setCellValue(l.getArticleCode());
                row.createCell(1).setCellValue(l.getArticleName());
                row.createCell(2).setCellValue(l.getNumNomenclature());
                row.createCell(3).setCellValue(l.getUnitesMesure());
                row.createCell(4).setCellValue(l.getQteTotal());
                row.createCell(5).setCellValue(l.getServices());
                row.createCell(6).setCellValue(l.getConsommateurs());
            }
            for (int i = 0; i < 7; i++) sheet.autoSizeColumn(i);
            wb.write(out); return out.toByteArray();
        } catch (Exception e) { throw new RuntimeException("Erreur Excel consommation", e); }
    }

    public byte[] excelBesoins(List<ArticleBesoinDto> articles) {
        try (XSSFWorkbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("Besoins");
            CellStyle hs = headerStyle(wb);
            headerRow(sheet, hs, "Code", "Désignation", "N° Nomenclature", "Stock actuel", "Seuil min", "Qté à commander", "Unité");
            int r = 1;
            for (ArticleBesoinDto a : articles) {
                Row row = sheet.createRow(r++);
                row.createCell(0).setCellValue(a.getArticleCode());
                row.createCell(1).setCellValue(a.getArticleName());
                row.createCell(2).setCellValue(a.getNumNomenclature());
                row.createCell(3).setCellValue(a.getStockActuel());
                row.createCell(4).setCellValue(a.getStockMinimum());
                row.createCell(5).setCellValue(a.getQteACommander());
                row.createCell(6).setCellValue(a.getUnitesMesure());
            }
            for (int i = 0; i < 7; i++) sheet.autoSizeColumn(i);
            wb.write(out); return out.toByteArray();
        } catch (Exception e) { throw new RuntimeException("Erreur Excel besoins", e); }
    }

    public byte[] excelGrandLivre(List<BienInventaire> biens) {
        try (XSSFWorkbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("Grand Livre");
            CellStyle hs = headerStyle(wb);
            headerRow(sheet, hs, "N° Inventaire", "Désignation", "Marque/Modèle", "Date acq.", "Prix (DA)", "État", "Statut", "Affectation");
            int r = 1;
            for (BienInventaire b : biens) {
                String aff = b.getAffectation() != null ? b.getAffectation().getLibelle()
                           : b.getAffectationLibre() != null ? b.getAffectationLibre() : "—";
                Row row = sheet.createRow(r++);
                row.createCell(0).setCellValue(b.getNumeroInventaire());
                row.createCell(1).setCellValue(b.getDesignation());
                row.createCell(2).setCellValue(b.getMarqueModele() != null ? b.getMarqueModele() : "—");
                row.createCell(3).setCellValue(b.getDateAcquisition().toString());
                row.createCell(4).setCellValue(b.getPrixAchat().doubleValue());
                row.createCell(5).setCellValue(b.getEtatMateriel().name());
                row.createCell(6).setCellValue(b.getStatut().name());
                row.createCell(7).setCellValue(aff);
            }
            for (int i = 0; i < 8; i++) sheet.autoSizeColumn(i);
            wb.write(out); return out.toByteArray();
        } catch (Exception e) { throw new RuntimeException("Erreur Excel grand livre", e); }
    }

    public byte[] excelEntrees(List<BonEntree> bons) {
        try (XSSFWorkbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("Entrées");
            CellStyle hs = headerStyle(wb);
            headerRow(sheet, hs, "N° Bon", "Date", "Type", "Fournisseur / Source", "Nb articles", "Montant total (DA)", "Visa");
            int r = 1;
            for (BonEntree b : bons) {
                String src = b.getFournisseur() != null ? b.getFournisseur().getRaisonSociale()
                           : b.getServiceSource() != null ? b.getServiceSource().getLibelle() : "—";
                double total = b.getLignes().stream()
                    .mapToDouble(l -> l.getPrixUnitaire().doubleValue() * l.getQuantite()).sum();
                Row row = sheet.createRow(r++);
                row.createCell(0).setCellValue(b.getNumeroBon());
                row.createCell(1).setCellValue(b.getDateBon().toString());
                row.createCell(2).setCellValue(b.getTypeBon().name().replace("_", " "));
                row.createCell(3).setCellValue(src);
                row.createCell(4).setCellValue(b.getLignes().size());
                row.createCell(5).setCellValue(total);
                row.createCell(6).setCellValue(b.getVisa() != null ? b.getVisa() : "—");
            }
            for (int i = 0; i < 7; i++) sheet.autoSizeColumn(i);
            wb.write(out); return out.toByteArray();
        } catch (Exception e) { throw new RuntimeException("Erreur Excel entrées", e); }
    }

    public byte[] excelSorties(List<BonSortie> bons) {
        try (XSSFWorkbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("Sorties");
            CellStyle hs = headerStyle(wb);
            headerRow(sheet, hs, "N° Bon", "Date", "Service dest.", "Demandeur", "Type sortie", "Nb articles", "Visa magasin.", "Visa approbat.");
            int r = 1;
            for (BonSortie b : bons) {
                Row row = sheet.createRow(r++);
                row.createCell(0).setCellValue(b.getNumeroBon());
                row.createCell(1).setCellValue(b.getDateBon().toString());
                row.createCell(2).setCellValue(b.getServiceDestination() != null ? b.getServiceDestination().getLibelle() : "—");
                row.createCell(3).setCellValue(b.getConsommateur() != null ? b.getConsommateur().getNomPrenom() : "—");
                row.createCell(4).setCellValue(b.getTypeSortie() != null ? b.getTypeSortie().name().replace("_", " ") : "—");
                row.createCell(5).setCellValue(b.getLignes().size());
                row.createCell(6).setCellValue(b.getVisaMagasinier() != null ? b.getVisaMagasinier() : "—");
                row.createCell(7).setCellValue(b.getVisaApprobateur() != null ? b.getVisaApprobateur() : "—");
            }
            for (int i = 0; i < 8; i++) sheet.autoSizeColumn(i);
            wb.write(out); return out.toByteArray();
        } catch (Exception e) { throw new RuntimeException("Erreur Excel sorties", e); }
    }

    // ── Helpers PDF ───────────────────────────────────────────────────
    private Paragraph titreDoc(String texte) {
        Font f = new Font(Font.HELVETICA, 14, Font.BOLD);
        Paragraph p = new Paragraph(texte, f);
        p.setAlignment(Element.ALIGN_CENTER);
        return p;
    }

    private PdfPTable tableAvecEntetes(String[] colonnes, float[] widths) throws DocumentException {
        PdfPTable table = new PdfPTable(colonnes.length);
        table.setWidthPercentage(100);
        table.setWidths(widths);
        Font hf = new Font(Font.HELVETICA, 9, Font.BOLD, Color.WHITE);
        for (String col : colonnes) {
            PdfPCell cell = new PdfPCell(new Phrase(col, hf));
            cell.setBackgroundColor(new Color(41, 128, 185));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setPadding(5);
            table.addCell(cell);
        }
        return table;
    }

    private Paragraph champ(String label, String valeur, Font labelFont, Font valFont) {
        Paragraph p = new Paragraph();
        p.add(new Chunk(label + " : ", labelFont));
        p.add(new Chunk(valeur, valFont));
        p.setSpacingAfter(4);
        return p;
    }

    private PdfPCell cellSig(String titre, Font f) {
        PdfPCell cell = new PdfPCell();
        cell.addElement(new Phrase(titre, f));
        cell.setMinimumHeight(60);
        cell.setPadding(8);
        return cell;
    }
}
