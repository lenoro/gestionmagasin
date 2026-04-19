package com.gestionmagasin.service;

import com.gestionmagasin.model.BienInventaire;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class ExportService {

    private static final String[] COLONNES = {
        "N° Inventaire", "Désignation", "Marque/Modèle",
        "Date Acquisition", "Prix Achat", "Affectation",
        "État", "Statut", "Observations"
    };

    public byte[] exporterPdf(List<BienInventaire> biens) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(doc, out);
            doc.open();

            Font titreFont = new Font(Font.HELVETICA, 14, Font.BOLD);
            Paragraph titre = new Paragraph("Registre d'Inventaire", titreFont);
            titre.setAlignment(Element.ALIGN_CENTER);
            doc.add(titre);
            doc.add(Chunk.NEWLINE);

            PdfPTable table = new PdfPTable(COLONNES.length);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{2f, 3f, 2.5f, 2f, 2f, 2.5f, 2f, 1.5f, 3f});

            Font headerFont = new Font(Font.HELVETICA, 9, Font.BOLD, Color.WHITE);
            for (String col : COLONNES) {
                PdfPCell cell = new PdfPCell(new Phrase(col, headerFont));
                cell.setBackgroundColor(new Color(41, 128, 185));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setPadding(5);
                table.addCell(cell);
            }

            Font cellFont = new Font(Font.HELVETICA, 8);
            for (BienInventaire b : biens) {
                table.addCell(new Phrase(b.getNumeroInventaire(), cellFont));
                table.addCell(new Phrase(b.getDesignation(), cellFont));
                table.addCell(new Phrase(b.getMarqueModele() != null ? b.getMarqueModele() : "", cellFont));
                table.addCell(new Phrase(b.getDateAcquisition().toString(), cellFont));
                table.addCell(new Phrase(b.getPrixAchat().toPlainString(), cellFont));
                table.addCell(new Phrase(affectationLabel(b), cellFont));
                table.addCell(new Phrase(b.getEtatMateriel().name(), cellFont));
                table.addCell(new Phrase(b.getStatut().name(), cellFont));
                table.addCell(new Phrase(b.getObservations() != null ? b.getObservations() : "", cellFont));
            }

            doc.add(table);
            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur génération PDF", e);
        }
    }

    public byte[] exporterExcel(List<BienInventaire> biens) {
        try (XSSFWorkbook wb = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = wb.createSheet("Registre Inventaire");

            CellStyle headerStyle = wb.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = wb.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            org.apache.poi.ss.usermodel.Row headerRow = sheet.createRow(0);
            for (int i = 0; i < COLONNES.length; i++) {
                org.apache.poi.ss.usermodel.Cell cell = headerRow.createCell(i);
                cell.setCellValue(COLONNES[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowNum = 1;
            for (BienInventaire b : biens) {
                org.apache.poi.ss.usermodel.Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(b.getNumeroInventaire());
                row.createCell(1).setCellValue(b.getDesignation());
                row.createCell(2).setCellValue(b.getMarqueModele() != null ? b.getMarqueModele() : "");
                row.createCell(3).setCellValue(b.getDateAcquisition().toString());
                row.createCell(4).setCellValue(b.getPrixAchat().doubleValue());
                row.createCell(5).setCellValue(affectationLabel(b));
                row.createCell(6).setCellValue(b.getEtatMateriel().name());
                row.createCell(7).setCellValue(b.getStatut().name());
                row.createCell(8).setCellValue(b.getObservations() != null ? b.getObservations() : "");
            }

            for (int i = 0; i < COLONNES.length; i++) {
                sheet.autoSizeColumn(i);
            }

            wb.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur génération Excel", e);
        }
    }

    private String affectationLabel(BienInventaire b) {
        if (b.getAffectation() != null) return b.getAffectation().getLibelle();
        if (b.getAffectationLibre() != null) return b.getAffectationLibre();
        return "";
    }
}
