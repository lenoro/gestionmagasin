package com.gestionmagasin.service;

import com.gestionmagasin.model.BonApprovisionnement;
import com.gestionmagasin.model.BonDistribution;
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
public class CarburantExportService {

    private static final String[] COL_APPRO = {
        "N° Bon", "Date", "Fournisseur", "Type", "Litres", "Prix unit.", "Statut"
    };
    private static final String[] COL_DISTRIB = {
        "N° Bon", "Date", "Véhicule", "Type", "Litres", "Km", "Chauffeur", "Visa"
    };

    // ── Appro PDF ─────────────────────────────────────────────────────────────
    public byte[] exporterListeApproPdf(List<BonApprovisionnement> bons) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(doc, out);
            doc.open();
            doc.add(titreDoc("Registre Carburant — Bons d'Approvisionnement"));
            doc.add(Chunk.NEWLINE);
            PdfPTable table = tableAvecEntetes(COL_APPRO, new float[]{2f, 2f, 3f, 2f, 2f, 2f, 2f});
            Font cf = new Font(Font.HELVETICA, 8);
            for (BonApprovisionnement b : bons) {
                table.addCell(new Phrase(b.getNumeroBon(), cf));
                table.addCell(new Phrase(b.getDateBon().toString(), cf));
                table.addCell(new Phrase(b.getFournisseur().getProducerName(), cf));
                table.addCell(new Phrase(b.getTypeCarburant().name(), cf));
                table.addCell(new Phrase(b.getQuantiteLitres().toString(), cf));
                table.addCell(new Phrase(b.getPrixUnitaire().toString(), cf));
                table.addCell(new Phrase(b.getStatut().name(), cf));
            }
            doc.add(table);
            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur export PDF appro carburant", e);
        }
    }

    // ── Appro Excel ───────────────────────────────────────────────────────────
    public byte[] exporterListeApproExcel(List<BonApprovisionnement> bons) {
        try (XSSFWorkbook wb = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("Approvisionnements");
            CellStyle hs = headerStyle(wb);
            Row header = sheet.createRow(0);
            for (int i = 0; i < COL_APPRO.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(COL_APPRO[i]);
                cell.setCellStyle(hs);
            }
            int rowIdx = 1;
            for (BonApprovisionnement b : bons) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(b.getNumeroBon());
                row.createCell(1).setCellValue(b.getDateBon().toString());
                row.createCell(2).setCellValue(b.getFournisseur().getProducerName());
                row.createCell(3).setCellValue(b.getTypeCarburant().name());
                row.createCell(4).setCellValue(b.getQuantiteLitres().doubleValue());
                row.createCell(5).setCellValue(b.getPrixUnitaire().doubleValue());
                row.createCell(6).setCellValue(b.getStatut().name());
            }
            for (int i = 0; i < COL_APPRO.length; i++) sheet.autoSizeColumn(i);
            wb.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur export Excel appro carburant", e);
        }
    }

    // ── Appro fiche individuelle ───────────────────────────────────────────────
    public byte[] imprimerBonAppro(BonApprovisionnement b) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4);
            PdfWriter.getInstance(doc, out);
            doc.open();
            Font titre = new Font(Font.HELVETICA, 14, Font.BOLD);
            Font label = new Font(Font.HELVETICA, 10, Font.BOLD);
            Font valeur = new Font(Font.HELVETICA, 10);
            doc.add(new Paragraph("BON D'APPROVISIONNEMENT — " + b.getNumeroBon(), titre));
            doc.add(Chunk.NEWLINE);
            doc.add(champ("Date", b.getDateBon().toString(), label, valeur));
            doc.add(champ("Fournisseur", b.getFournisseur().getProducerName(), label, valeur));
            doc.add(champ("Type carburant", b.getTypeCarburant().name(), label, valeur));
            doc.add(champ("Quantité (L)", b.getQuantiteLitres().toString(), label, valeur));
            doc.add(champ("Prix unitaire", b.getPrixUnitaire().toString(), label, valeur));
            doc.add(champ("Montant total",
                b.getQuantiteLitres().multiply(b.getPrixUnitaire()).toString(), label, valeur));
            doc.add(champ("Statut", b.getStatut().name(), label, valeur));
            doc.add(champ("Observations", b.getObservations() != null ? b.getObservations() : "—", label, valeur));
            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur impression bon appro", e);
        }
    }

    // ── Distribution PDF ──────────────────────────────────────────────────────
    public byte[] exporterListeDistribPdf(List<BonDistribution> bons) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(doc, out);
            doc.open();
            doc.add(titreDoc("Registre Carburant — Bons de Distribution"));
            doc.add(Chunk.NEWLINE);
            PdfPTable table = tableAvecEntetes(COL_DISTRIB, new float[]{2f, 2f, 2f, 1.5f, 1.5f, 1.5f, 2f, 1.5f});
            Font cf = new Font(Font.HELVETICA, 8);
            for (BonDistribution b : bons) {
                table.addCell(new Phrase(b.getNumeroBon(), cf));
                table.addCell(new Phrase(b.getDateBon().toString(), cf));
                table.addCell(new Phrase(b.getVehicule().getImmatriculation(), cf));
                table.addCell(new Phrase(b.getTypeCarburant().name(), cf));
                table.addCell(new Phrase(b.getQuantiteLitres().toString(), cf));
                table.addCell(new Phrase(b.getKilometrage() != null ? b.getKilometrage().toString() : "—", cf));
                table.addCell(new Phrase(b.getChauffeur() != null ? b.getChauffeur() : "—", cf));
                table.addCell(new Phrase(b.getVisa() != null ? b.getVisa() : "—", cf));
            }
            doc.add(table);
            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur export PDF distribution carburant", e);
        }
    }

    // ── Distribution Excel ────────────────────────────────────────────────────
    public byte[] exporterListeDistribExcel(List<BonDistribution> bons) {
        try (XSSFWorkbook wb = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("Distributions");
            CellStyle hs = headerStyle(wb);
            Row header = sheet.createRow(0);
            for (int i = 0; i < COL_DISTRIB.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(COL_DISTRIB[i]);
                cell.setCellStyle(hs);
            }
            int rowIdx = 1;
            for (BonDistribution b : bons) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(b.getNumeroBon());
                row.createCell(1).setCellValue(b.getDateBon().toString());
                row.createCell(2).setCellValue(b.getVehicule().getImmatriculation());
                row.createCell(3).setCellValue(b.getTypeCarburant().name());
                row.createCell(4).setCellValue(b.getQuantiteLitres().doubleValue());
                row.createCell(5).setCellValue(b.getKilometrage() != null ? b.getKilometrage() : 0);
                row.createCell(6).setCellValue(b.getChauffeur() != null ? b.getChauffeur() : "");
                row.createCell(7).setCellValue(b.getVisa() != null ? b.getVisa() : "");
            }
            for (int i = 0; i < COL_DISTRIB.length; i++) sheet.autoSizeColumn(i);
            wb.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur export Excel distribution carburant", e);
        }
    }

    // ── Distribution fiche individuelle ───────────────────────────────────────
    public byte[] imprimerBonDistrib(BonDistribution b) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4);
            PdfWriter.getInstance(doc, out);
            doc.open();
            Font titre = new Font(Font.HELVETICA, 14, Font.BOLD);
            Font label = new Font(Font.HELVETICA, 10, Font.BOLD);
            Font valeur = new Font(Font.HELVETICA, 10);
            doc.add(new Paragraph("BON DE DISTRIBUTION — " + b.getNumeroBon(), titre));
            doc.add(Chunk.NEWLINE);
            doc.add(champ("Date", b.getDateBon().toString(), label, valeur));
            doc.add(champ("Véhicule", b.getVehicule().getImmatriculation()
                + " (" + b.getVehicule().getMarque() + ")", label, valeur));
            doc.add(champ("Type carburant", b.getTypeCarburant().name(), label, valeur));
            doc.add(champ("Quantité (L)", b.getQuantiteLitres().toString(), label, valeur));
            doc.add(champ("Kilométrage", b.getKilometrage() != null ? b.getKilometrage().toString() : "—", label, valeur));
            doc.add(champ("Chauffeur", b.getChauffeur() != null ? b.getChauffeur() : "—", label, valeur));
            doc.add(champ("Visa", b.getVisa() != null ? b.getVisa() : "—", label, valeur));
            doc.add(champ("Observations", b.getObservations() != null ? b.getObservations() : "—", label, valeur));
            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur impression bon distribution", e);
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

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

    private CellStyle headerStyle(XSSFWorkbook wb) {
        CellStyle s = wb.createCellStyle();
        s.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        s.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        return s;
    }
}
