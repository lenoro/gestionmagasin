package com.gestionmagasin.controller;

import com.gestionmagasin.service.StockEtatsService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/etats")
@CrossOrigin(origins = "*")
public class StockEtatsController {

    private final StockEtatsService service;

    public StockEtatsController(StockEtatsService service) {
        this.service = service;
    }

    // GET /api/etats/bjr?dateDebut=2024-01-01&dateFin=2024-01-31
    @GetMapping("/bjr")
    public ResponseEntity<byte[]> bjr(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {
        byte[] pdf = service.bulletinJournalierReception(dateDebut, dateFin);
        return pdfResponse(pdf, "bjr-" + dateDebut + ".pdf");
    }

    // GET /api/etats/ejs?dateDebut=2024-01-01&dateFin=2024-01-07
    @GetMapping("/ejs")
    public ResponseEntity<byte[]> ejs(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {
        byte[] pdf = service.etatJournalierSorties(dateDebut, dateFin);
        return pdfResponse(pdf, "ejs-" + dateDebut + ".pdf");
    }

    // GET /api/etats/reforme
    @GetMapping("/reforme")
    public ResponseEntity<byte[]> reforme() {
        byte[] pdf = service.etatMaterielReforme();
        return pdfResponse(pdf, "etat-reforme.pdf");
    }

    // GET /api/etats/besoins?section=Inf&agent=Dupont&annee=2025
    @GetMapping("/besoins")
    public ResponseEntity<byte[]> besoins(
            @RequestParam(required = false) String section,
            @RequestParam(required = false) String agent,
            @RequestParam(defaultValue = "0") int annee) {
        if (annee == 0) annee = LocalDate.now().getYear();
        byte[] pdf = service.etatDesBesoins(section, agent, annee);
        return pdfResponse(pdf, "etat-besoins-" + annee + ".pdf");
    }

    // GET /api/etats/fc-mc/{articleId}
    @GetMapping("/fc-mc/{articleId}")
    public ResponseEntity<byte[]> fichierCentralMC(@PathVariable Long articleId) {
        byte[] pdf = service.fichierCentralConsomptible(articleId);
        return pdfResponse(pdf, "fc-mc-" + articleId + ".pdf");
    }

    // GET /api/etats/fc-mnc/{bienId}
    @GetMapping("/fc-mnc/{bienId}")
    public ResponseEntity<byte[]> fichierCentralMNC(@PathVariable Long bienId) {
        byte[] pdf = service.fichierCentralNonConsomptible(bienId);
        return pdfResponse(pdf, "fc-mnc-" + bienId + ".pdf");
    }

    // GET /api/etats/rsr
    @GetMapping("/rsr")
    public ResponseEntity<byte[]> rsr() {
        byte[] pdf = service.registreSuiviRSR();
        return pdfResponse(pdf, "registre-rsr.pdf");
    }

    // GET /api/etats/registre-matiere
    @GetMapping("/registre-matiere")
    public ResponseEntity<byte[]> registreMatiere() {
        byte[] pdf = service.registreMatiere();
        return pdfResponse(pdf, "registre-matiere.pdf");
    }

    // GET /api/etats/rgbi
    @GetMapping("/rgbi")
    public ResponseEntity<byte[]> rgbi() {
        byte[] pdf = service.registreBiensImmobiliers();
        return pdfResponse(pdf, "registre-rgbi.pdf");
    }

    // GET /api/etats/pv-cession?directeur=...&cfpDestination=...&bienIds=1,2,3
    @GetMapping("/pv-cession")
    public ResponseEntity<byte[]> pvCession(
            @RequestParam(required = false) String directeur,
            @RequestParam(required = false) String cfpDestination,
            @RequestParam(required = false) List<Long> bienIds) {
        byte[] pdf = service.pvCessionTransfert(directeur, cfpDestination,
                bienIds != null ? bienIds : Collections.emptyList());
        return pdfResponse(pdf, "pv-cession-transfert.pdf");
    }

    // GET /api/etats/pv-perte-vol?directeur=...&intendant=...&magasinier=...&circonstances=...&bienIds=1,2,3
    @GetMapping("/pv-perte-vol")
    public ResponseEntity<byte[]> pvPerteVol(
            @RequestParam(required = false) String directeur,
            @RequestParam(required = false) String intendant,
            @RequestParam(required = false) String magasinier,
            @RequestParam(required = false) String circonstances,
            @RequestParam(required = false) List<Long> bienIds) {
        byte[] pdf = service.pvPerteVol(directeur, intendant, magasinier, circonstances,
                bienIds != null ? bienIds : Collections.emptyList());
        return pdfResponse(pdf, "pv-perte-vol.pdf");
    }

    // GET /api/etats/pv-reforme?directeur=...&cfpa=...&intendant=...&magasinier=...
    @GetMapping("/pv-reforme")
    public ResponseEntity<byte[]> pvReforme(
            @RequestParam(required = false) String directeur,
            @RequestParam(required = false) String cfpa,
            @RequestParam(required = false) String intendant,
            @RequestParam(required = false) String magasinier) {
        byte[] pdf = service.pvReforme(directeur, cfpa, intendant, magasinier);
        return pdfResponse(pdf, "pv-reforme.pdf");
    }

    private ResponseEntity<byte[]> pdfResponse(byte[] data, String filename) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(data);
    }
}
