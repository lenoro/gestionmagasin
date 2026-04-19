package com.gestionmagasin.service;

import com.gestionmagasin.model.Ouvrage;
import com.lowagie.text.Chunk;
import com.lowagie.text.Document;
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
public class BibliothequeExportService {

    private static final String[] COLONNES = {
        "N° Ouvrage", "Titre", "Auteur", "Domaine", "Éditeur", "Année", "Localisation", "Exemplaires"
    };

    public byte[] exporterListePdf(List<Ouvrage> ouvrages) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(doc, out);
            doc.open();
            Font titreFont = new Font(Font.HELVETICA, 14, Font.BOLD);
            Paragraph titre = new Paragraph("Registre des Ouvrages de Bibliothèque", titreFont);
            titre.setAlignment(Element.ALIGN_CENTER);
            doc.add(titre);
            doc.add(Chunk.NEWLINE);
            PdfPTable table = new PdfPTable(COLONNES.length);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{2f, 4f, 3f, 2f, 2.5f, 1.5f, 2f, 1.5f});
            Font hf = new Font(Font.HELVETICA, 9, Font.BOLD, Color.WHITE);
            for (String col : COLONNES) {
                PdfPCell cell = new PdfPCell(new Phrase(col, hf));
                cell.setBackgroundColor(new Color(0, 51, 102));
                cell.setPadding(4);
                table.addCell(cell);
            }
            Font cf = new Font(Font.HELVETICA, 8);
            for (Ouvrage o : ouvrages) {
                table.addCell(new Phrase(o.getNumeroOuvrage(), cf));
                table.addCell(new Phrase(o.getTitre(), cf));
                table.addCell(new Phrase(o.getAuteur(), cf));
                table.addCell(new Phrase(o.getDomaine().name(), cf));
                table.addCell(new Phrase(o.getEditeur() != null ? o.getEditeur() : "—", cf));
                table.addCell(new Phrase(o.getAnneePublication() != null ? o.getAnneePublication().toString() : "—", cf));
                table.addCell(new Phrase(o.getLocalisation() != null ? o.getLocalisation() : "—", cf));
                table.addCell(new Phrase(o.getNbreExemplaires().toString(), cf));
            }
            doc.add(table);
            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur export PDF bibliothèque", e);
        }
    }

    public byte[] exporterListeExcel(List<Ouvrage> ouvrages) {
        try (XSSFWorkbook wb = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("Ouvrages");
            CellStyle hs = wb.createCellStyle();
            hs.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            hs.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            Row header = sheet.createRow(0);
            for (int i = 0; i < COLONNES.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(COLONNES[i]);
                cell.setCellStyle(hs);
            }
            int rowIdx = 1;
            for (Ouvrage o : ouvrages) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(o.getNumeroOuvrage());
                row.createCell(1).setCellValue(o.getTitre());
                row.createCell(2).setCellValue(o.getAuteur());
                row.createCell(3).setCellValue(o.getDomaine().name());
                row.createCell(4).setCellValue(o.getEditeur() != null ? o.getEditeur() : "");
                row.createCell(5).setCellValue(o.getAnneePublication() != null ? o.getAnneePublication() : 0);
                row.createCell(6).setCellValue(o.getLocalisation() != null ? o.getLocalisation() : "");
                row.createCell(7).setCellValue(o.getNbreExemplaires());
            }
            for (int i = 0; i < COLONNES.length; i++) sheet.autoSizeColumn(i);
            wb.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur export Excel bibliothèque", e);
        }
    }
}
