package com.gestionmagasin.controller;

import com.gestionmagasin.dto.ArticleBesoinDto;
import com.gestionmagasin.dto.LigneConsommationDto;
import com.gestionmagasin.model.BienInventaire;
import com.gestionmagasin.model.BonEntree;
import com.gestionmagasin.model.BonSortie;
import com.gestionmagasin.service.RgbiRapportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/rapports")
public class RgbiRapportController {

    private final RgbiRapportService service;

    public RgbiRapportController(RgbiRapportService service) {
        this.service = service;
    }

    // ── Données JSON ─────────────────────────────────────────────────

    @GetMapping("/consommation")
    public List<LigneConsommationDto> consommation(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin,
            @RequestParam(required = false) Long affectationId,
            @RequestParam(required = false) Long consommateurId) {
        return service.getConsommation(dateDebut, dateFin, affectationId, consommateurId);
    }

    @GetMapping("/besoins")
    public List<ArticleBesoinDto> besoins() {
        return service.getBesoins();
    }

    @GetMapping("/grand-livre")
    public List<BienInventaire> grandLivre(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {
        return service.getGrandLivre(dateDebut, dateFin);
    }

    @GetMapping("/fiche-bien/{id}")
    public BienInventaire ficheBien(@PathVariable Long id) {
        return service.getFicheBien(id);
    }

    @GetMapping("/entrees")
    public List<BonEntree> entrees(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin,
            @RequestParam(required = false) Long fournisseurId) {
        return service.getEntrees(dateDebut, dateFin, fournisseurId);
    }

    @GetMapping("/sorties")
    public List<BonSortie> sorties(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin,
            @RequestParam(required = false) Long affectationId,
            @RequestParam(required = false) Long consommateurId) {
        return service.getSorties(dateDebut, dateFin, affectationId, consommateurId);
    }

    @GetMapping("/bordereau/{id}")
    public BonSortie bordereau(@PathVariable Long id) {
        return service.getBordereau(id);
    }

    // ── PDF ──────────────────────────────────────────────────────────

    @GetMapping("/consommation/pdf")
    public ResponseEntity<byte[]> consommationPdf(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin,
            @RequestParam(required = false) Long affectationId,
            @RequestParam(required = false) Long consommateurId) {
        byte[] pdf = service.pdfConsommation(service.getConsommation(dateDebut, dateFin, affectationId, consommateurId));
        return pdfResponse(pdf, "registre-consommation.pdf");
    }

    @GetMapping("/besoins/pdf")
    public ResponseEntity<byte[]> besoinsPdf() {
        return pdfResponse(service.pdfBesoins(service.getBesoins()), "etat-besoins.pdf");
    }

    @GetMapping("/grand-livre/pdf")
    public ResponseEntity<byte[]> grandLivrePdf(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {
        return pdfResponse(service.pdfGrandLivre(service.getGrandLivre(dateDebut, dateFin)), "grand-livre-inventaire.pdf");
    }

    @GetMapping("/fiche-bien/{id}/pdf")
    public ResponseEntity<byte[]> ficheBienPdf(@PathVariable Long id) {
        return pdfResponse(service.pdfFicheBien(service.getFicheBien(id)), "fiche-bien-" + id + ".pdf");
    }

    @GetMapping("/entrees/pdf")
    public ResponseEntity<byte[]> entreesPdf(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin,
            @RequestParam(required = false) Long fournisseurId) {
        return pdfResponse(service.pdfEntrees(service.getEntrees(dateDebut, dateFin, fournisseurId)), "registre-entrees.pdf");
    }

    @GetMapping("/sorties/pdf")
    public ResponseEntity<byte[]> sortiesPdf(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin,
            @RequestParam(required = false) Long affectationId,
            @RequestParam(required = false) Long consommateurId) {
        return pdfResponse(service.pdfSorties(service.getSorties(dateDebut, dateFin, affectationId, consommateurId)), "registre-sorties.pdf");
    }

    @GetMapping("/bordereau/{id}/pdf")
    public ResponseEntity<byte[]> bordereauPdf(@PathVariable Long id) {
        return pdfResponse(service.pdfBordereau(service.getBordereau(id)), "bordereau-transmission-" + id + ".pdf");
    }

    // ── Excel (rapports 1, 2, 3, 5, 6) ─────────────────────────────

    @GetMapping("/consommation/excel")
    public ResponseEntity<byte[]> consommationExcel(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin,
            @RequestParam(required = false) Long affectationId,
            @RequestParam(required = false) Long consommateurId) {
        return excelResponse(service.excelConsommation(service.getConsommation(dateDebut, dateFin, affectationId, consommateurId)), "registre-consommation.xlsx");
    }

    @GetMapping("/besoins/excel")
    public ResponseEntity<byte[]> besoinsExcel() {
        return excelResponse(service.excelBesoins(service.getBesoins()), "etat-besoins.xlsx");
    }

    @GetMapping("/grand-livre/excel")
    public ResponseEntity<byte[]> grandLivreExcel(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {
        return excelResponse(service.excelGrandLivre(service.getGrandLivre(dateDebut, dateFin)), "grand-livre-inventaire.xlsx");
    }

    @GetMapping("/entrees/excel")
    public ResponseEntity<byte[]> entreesExcel(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin,
            @RequestParam(required = false) Long fournisseurId) {
        return excelResponse(service.excelEntrees(service.getEntrees(dateDebut, dateFin, fournisseurId)), "registre-entrees.xlsx");
    }

    @GetMapping("/sorties/excel")
    public ResponseEntity<byte[]> sortiesExcel(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin,
            @RequestParam(required = false) Long affectationId,
            @RequestParam(required = false) Long consommateurId) {
        return excelResponse(service.excelSorties(service.getSorties(dateDebut, dateFin, affectationId, consommateurId)), "registre-sorties.xlsx");
    }

    // ── Helpers ──────────────────────────────────────────────────────

    private ResponseEntity<byte[]> pdfResponse(byte[] data, String filename) {
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
            .contentType(MediaType.APPLICATION_PDF)
            .body(data);
    }

    private ResponseEntity<byte[]> excelResponse(byte[] data, String filename) {
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
            .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
            .body(data);
    }
}
