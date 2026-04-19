package com.gestionmagasin.service;

import com.gestionmagasin.model.FicheReparation;
import com.gestionmagasin.model.LigneFicheReparation;
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
import java.util.List;

@Service
public class RsrExportService {

    private static final String[] COL_LISTE = {
        "N° Fiche", "Bien", "Motif", "Réparateur", "Statut", "Date envoi", "Date retour"
    };

    public byte[] exporterListeFichesPdf(List<FicheReparation> fiches) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(doc, out);
            doc.open();
            doc.add(titreDoc("RSR — Registre de Suivi des Réparations"));
            doc.add(Chunk.NEWLINE);
            PdfPTable table = tableAvecEntetes(COL_LISTE, new float[]{2f, 3f, 3f, 2f, 2f, 2f, 2f});
            Font cf = new Font(Font.HELVETICA, 8);
            for (FicheReparation f : fiches) {
                table.addCell(new Phrase(f.getNumeroFiche(), cf));
                table.addCell(new Phrase(f.getBien().getDesignation(), cf));
                table.addCell(new Phrase(f.getMotif(), cf));
                table.addCell(new Phrase(f.getReparateur() != null ? f.getReparateur() : "—", cf));
                table.addCell(new Phrase(f.getStatut().name(), cf));
                table.addCell(new Phrase(f.getDateEnvoi() != null ? f.getDateEnvoi().toString() : "—", cf));
                table.addCell(new Phrase(f.getDateRetour() != null ? f.getDateRetour().toString() : "—", cf));
            }
            doc.add(table);
            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur export PDF liste RSR", e);
        }
    }

    public byte[] exporterListeFichesExcel(List<FicheReparation> fiches) {
        try (XSSFWorkbook wb = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("RSR");
            CellStyle headerStyle = wb.createCellStyle();
            headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            Row header = sheet.createRow(0);
            for (int i = 0; i < COL_LISTE.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(COL_LISTE[i]);
                cell.setCellStyle(headerStyle);
            }
            int rowIdx = 1;
            for (FicheReparation f : fiches) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(f.getNumeroFiche());
                row.createCell(1).setCellValue(f.getBien().getDesignation());
                row.createCell(2).setCellValue(f.getMotif());
                row.createCell(3).setCellValue(f.getReparateur() != null ? f.getReparateur() : "");
                row.createCell(4).setCellValue(f.getStatut().name());
                row.createCell(5).setCellValue(f.getDateEnvoi() != null ? f.getDateEnvoi().toString() : "");
                row.createCell(6).setCellValue(f.getDateRetour() != null ? f.getDateRetour().toString() : "");
            }
            for (int i = 0; i < COL_LISTE.length; i++) sheet.autoSizeColumn(i);
            wb.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur export Excel liste RSR", e);
        }
    }

    public byte[] imprimerFicheReparation(FicheReparation f) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4);
            PdfWriter.getInstance(doc, out);
            doc.open();

            Font titre = new Font(Font.HELVETICA, 14, Font.BOLD);
            Font label = new Font(Font.HELVETICA, 10, Font.BOLD);
            Font valeur = new Font(Font.HELVETICA, 10);

            doc.add(new Paragraph("FICHE DE RÉPARATION — " + f.getNumeroFiche(), titre));
            doc.add(Chunk.NEWLINE);
            doc.add(champ("Bien", f.getBien().getDesignation(), label, valeur));
            doc.add(champ("Motif", f.getMotif(), label, valeur));
            doc.add(champ("Statut", f.getStatut().name(), label, valeur));
            doc.add(champ("Réparateur", f.getReparateur() != null ? f.getReparateur() : "—", label, valeur));
            doc.add(champ("Fournisseur",
                f.getFournisseur() != null ? f.getFournisseur().getProducerName() : "—", label, valeur));
            doc.add(champ("Coût réparation",
                f.getCoutReparation() != null ? f.getCoutReparation().toString() : "—", label, valeur));
            doc.add(champ("Date envoi",
                f.getDateEnvoi() != null ? f.getDateEnvoi().toString() : "—", label, valeur));
            doc.add(champ("Date retour",
                f.getDateRetour() != null ? f.getDateRetour().toString() : "—", label, valeur));
            doc.add(champ("Date clôture",
                f.getDateCloture() != null ? f.getDateCloture().toString() : "—", label, valeur));
            doc.add(champ("Observations",
                f.getObservations() != null ? f.getObservations() : "—", label, valeur));

            if (!f.getLignes().isEmpty()) {
                doc.add(Chunk.NEWLINE);
                doc.add(new Paragraph("Pièces de rechange :", label));
                doc.add(Chunk.NEWLINE);
                PdfPTable table = tableAvecEntetes(
                    new String[]{"Article", "Quantité"}, new float[]{4f, 2f});
                Font cf = new Font(Font.HELVETICA, 9);
                for (LigneFicheReparation ligne : f.getLignes()) {
                    table.addCell(new Phrase(ligne.getArticle().getArticleName(), cf));
                    table.addCell(new Phrase(String.valueOf(ligne.getQuantite()), cf));
                }
                doc.add(table);
            }

            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur impression fiche RSR", e);
        }
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private Paragraph titreDoc(String texte) throws DocumentException {
        Font f = new Font(Font.HELVETICA, 14, Font.BOLD);
        Paragraph p = new Paragraph(texte, f);
        p.setAlignment(Element.ALIGN_CENTER);
        return p;
    }

    private PdfPTable tableAvecEntetes(String[] colonnes, float[] largeurs) throws DocumentException {
        PdfPTable table = new PdfPTable(colonnes.length);
        table.setWidthPercentage(100);
        table.setWidths(largeurs);
        Font hf = new Font(Font.HELVETICA, 9, Font.BOLD, Color.WHITE);
        for (String col : colonnes) {
            PdfPCell cell = new PdfPCell(new Phrase(col, hf));
            cell.setBackgroundColor(new Color(0, 51, 102));
            cell.setPadding(4);
            table.addCell(cell);
        }
        return table;
    }

    private Paragraph champ(String label, String valeur, Font lf, Font vf) {
        Paragraph p = new Paragraph();
        p.add(new Phrase(label + " : ", lf));
        p.add(new Phrase(valeur, vf));
        p.setSpacingAfter(4);
        return p;
    }
}
