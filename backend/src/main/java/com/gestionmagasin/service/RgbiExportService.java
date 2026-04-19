package com.gestionmagasin.service;

import com.gestionmagasin.model.BonEntree;
import com.gestionmagasin.model.BonSortie;
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
public class RgbiExportService {

    private static final String[] COL_ENTREE = {
        "N° Bon", "Type", "Date", "Source", "Statut", "Visa"
    };
    private static final String[] COL_SORTIE = {
        "N° Bon", "Type", "Date", "Service dest.", "Statut", "Visa magasinier"
    };

    public byte[] exporterListeBonsEntreePdf(List<BonEntree> bons) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(doc, out);
            doc.open();
            doc.add(titreDoc("Registre RGBI — Bons d'Entrée"));
            doc.add(Chunk.NEWLINE);
            PdfPTable table = tableAvecEntetes(COL_ENTREE, new float[]{2f, 3f, 2f, 3f, 2f, 2f});
            Font cf = new Font(Font.HELVETICA, 8);
            for (BonEntree b : bons) {
                table.addCell(new Phrase(b.getNumeroBon(), cf));
                table.addCell(new Phrase(b.getTypeBon().name(), cf));
                table.addCell(new Phrase(b.getDateBon().toString(), cf));
                String source = b.getFournisseur() != null
                    ? b.getFournisseur().getProducerName()
                    : (b.getServiceSource() != null ? b.getServiceSource().getLibelle() : "—");
                table.addCell(new Phrase(source, cf));
                table.addCell(new Phrase(b.getStatut().name(), cf));
                table.addCell(new Phrase(b.getVisa() != null ? b.getVisa() : "—", cf));
            }
            doc.add(table);
            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur export PDF bons entrée", e);
        }
    }

    public byte[] exporterListeBonsSortiePdf(List<BonSortie> bons) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(doc, out);
            doc.open();
            doc.add(titreDoc("Registre RGBI — Bons de Sortie"));
            doc.add(Chunk.NEWLINE);
            PdfPTable table = tableAvecEntetes(COL_SORTIE, new float[]{2f, 2.5f, 2f, 3f, 2.5f, 2.5f});
            Font cf = new Font(Font.HELVETICA, 8);
            for (BonSortie b : bons) {
                table.addCell(new Phrase(b.getNumeroBon(), cf));
                table.addCell(new Phrase(b.getTypeBon().name(), cf));
                table.addCell(new Phrase(b.getDateBon().toString(), cf));
                table.addCell(new Phrase(b.getServiceDestination() != null ? b.getServiceDestination().getLibelle() : "—", cf));
                table.addCell(new Phrase(b.getStatut().name(), cf));
                table.addCell(new Phrase(b.getVisaMagasinier() != null ? b.getVisaMagasinier() : "—", cf));
            }
            doc.add(table);
            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur export PDF bons sortie", e);
        }
    }

    public byte[] imprimerFicheBonEntree(BonEntree bon) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4);
            PdfWriter.getInstance(doc, out);
            doc.open();
            Font titreFont = new Font(Font.HELVETICA, 14, Font.BOLD);
            Font labelFont = new Font(Font.HELVETICA, 10, Font.BOLD);
            Font valFont = new Font(Font.HELVETICA, 10);
            doc.add(new Paragraph("BON D'ENTRÉE — " + bon.getNumeroBon(), titreFont));
            doc.add(Chunk.NEWLINE);
            doc.add(new Paragraph("Type : " + bon.getTypeBon().name(), valFont));
            doc.add(new Paragraph("Date : " + bon.getDateBon(), valFont));
            String source = bon.getFournisseur() != null
                ? "Fournisseur : " + bon.getFournisseur().getProducerName()
                : "Service source : " + (bon.getServiceSource() != null ? bon.getServiceSource().getLibelle() : "—");
            doc.add(new Paragraph(source, valFont));
            doc.add(new Paragraph("Statut : " + bon.getStatut().name(), valFont));
            doc.add(new Paragraph("Visa : " + (bon.getVisa() != null ? bon.getVisa() : "—"), valFont));
            if (bon.getObservations() != null) doc.add(new Paragraph("Observations : " + bon.getObservations(), valFont));
            doc.add(Chunk.NEWLINE);
            doc.add(new Paragraph("Articles :", labelFont));
            PdfPTable table = tableAvecEntetes(new String[]{"Article", "Quantité", "Prix unitaire"}, new float[]{4f, 2f, 2f});
            Font cf = new Font(Font.HELVETICA, 9);
            for (var ligne : bon.getLignes()) {
                table.addCell(new Phrase(ligne.getArticle().getArticleName(), cf));
                table.addCell(new Phrase(String.valueOf(ligne.getQuantite()), cf));
                table.addCell(new Phrase(ligne.getPrixUnitaire().toPlainString(), cf));
            }
            doc.add(table);
            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur impression bon entrée", e);
        }
    }

    public byte[] imprimerFicheBonSortie(BonSortie bon) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4);
            PdfWriter.getInstance(doc, out);
            doc.open();
            Font titreFont = new Font(Font.HELVETICA, 14, Font.BOLD);
            Font labelFont = new Font(Font.HELVETICA, 10, Font.BOLD);
            Font valFont = new Font(Font.HELVETICA, 10);
            doc.add(new Paragraph("BON DE SORTIE — " + bon.getNumeroBon(), titreFont));
            doc.add(Chunk.NEWLINE);
            doc.add(new Paragraph("Type : " + bon.getTypeBon().name(), valFont));
            doc.add(new Paragraph("Date : " + bon.getDateBon(), valFont));
            doc.add(new Paragraph("Service : " + (bon.getServiceDestination() != null ? bon.getServiceDestination().getLibelle() : "—"), valFont));
            doc.add(new Paragraph("Statut : " + bon.getStatut().name(), valFont));
            doc.add(new Paragraph("Visa magasinier : " + (bon.getVisaMagasinier() != null ? bon.getVisaMagasinier() : "—"), valFont));
            doc.add(new Paragraph("Visa approbateur : " + (bon.getVisaApprobateur() != null ? bon.getVisaApprobateur() : "—"), valFont));
            if (bon.getObservations() != null) doc.add(new Paragraph("Observations : " + bon.getObservations(), valFont));
            doc.add(Chunk.NEWLINE);
            doc.add(new Paragraph("Articles :", labelFont));
            PdfPTable table = tableAvecEntetes(new String[]{"Article", "Quantité"}, new float[]{5f, 2f});
            Font cf = new Font(Font.HELVETICA, 9);
            for (var ligne : bon.getLignes()) {
                table.addCell(new Phrase(ligne.getArticle().getArticleName(), cf));
                table.addCell(new Phrase(String.valueOf(ligne.getQuantite()), cf));
            }
            doc.add(table);
            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur impression bon sortie", e);
        }
    }

    public byte[] exporterListeBonsEntreeExcel(List<BonEntree> bons) {
        try (XSSFWorkbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("Bons Entrée");
            CellStyle hs = headerStyle(wb);
            Row hr = sheet.createRow(0);
            for (int i = 0; i < COL_ENTREE.length; i++) { Cell c = hr.createCell(i); c.setCellValue(COL_ENTREE[i]); c.setCellStyle(hs); }
            int r = 1;
            for (BonEntree b : bons) {
                Row row = sheet.createRow(r++);
                row.createCell(0).setCellValue(b.getNumeroBon());
                row.createCell(1).setCellValue(b.getTypeBon().name());
                row.createCell(2).setCellValue(b.getDateBon().toString());
                String src = b.getFournisseur() != null ? b.getFournisseur().getProducerName()
                    : (b.getServiceSource() != null ? b.getServiceSource().getLibelle() : "");
                row.createCell(3).setCellValue(src);
                row.createCell(4).setCellValue(b.getStatut().name());
                row.createCell(5).setCellValue(b.getVisa() != null ? b.getVisa() : "");
            }
            for (int i = 0; i < COL_ENTREE.length; i++) sheet.autoSizeColumn(i);
            wb.write(out); return out.toByteArray();
        } catch (Exception e) { throw new RuntimeException("Erreur export Excel bons entrée", e); }
    }

    public byte[] exporterListeBonsSortieExcel(List<BonSortie> bons) {
        try (XSSFWorkbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("Bons Sortie");
            CellStyle hs = headerStyle(wb);
            Row hr = sheet.createRow(0);
            for (int i = 0; i < COL_SORTIE.length; i++) { Cell c = hr.createCell(i); c.setCellValue(COL_SORTIE[i]); c.setCellStyle(hs); }
            int r = 1;
            for (BonSortie b : bons) {
                Row row = sheet.createRow(r++);
                row.createCell(0).setCellValue(b.getNumeroBon());
                row.createCell(1).setCellValue(b.getTypeBon().name());
                row.createCell(2).setCellValue(b.getDateBon().toString());
                row.createCell(3).setCellValue(b.getServiceDestination() != null ? b.getServiceDestination().getLibelle() : "");
                row.createCell(4).setCellValue(b.getStatut().name());
                row.createCell(5).setCellValue(b.getVisaMagasinier() != null ? b.getVisaMagasinier() : "");
            }
            for (int i = 0; i < COL_SORTIE.length; i++) sheet.autoSizeColumn(i);
            wb.write(out); return out.toByteArray();
        } catch (Exception e) { throw new RuntimeException("Erreur export Excel bons sortie", e); }
    }

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

    private CellStyle headerStyle(XSSFWorkbook wb) {
        CellStyle s = wb.createCellStyle();
        org.apache.poi.ss.usermodel.Font f = wb.createFont();
        f.setBold(true);
        s.setFont(f);
        s.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
        s.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        return s;
    }
}
