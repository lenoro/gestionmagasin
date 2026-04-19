package com.gestionmagasin.controller;

import com.gestionmagasin.model.FicheReparation;
import com.gestionmagasin.service.FicheReparationService;
import com.gestionmagasin.service.RsrExportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fiches-reparation")
@CrossOrigin(origins = "*")
public class FicheReparationController {

    private final FicheReparationService service;
    private final RsrExportService exportService;

    public FicheReparationController(FicheReparationService service, RsrExportService exportService) {
        this.service = service;
        this.exportService = exportService;
    }

    @GetMapping
    public List<FicheReparation> findAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public FicheReparation findById(@PathVariable Long id) { return service.findById(id); }

    @PostMapping
    public FicheReparation create(@RequestBody FicheReparation fiche) { return service.creer(fiche); }

    @PostMapping("/{id}/envoyer")
    public FicheReparation envoyer(@PathVariable Long id) { return service.envoyer(id); }

    @PostMapping("/{id}/retourner")
    public FicheReparation retourner(@PathVariable Long id) { return service.retourner(id); }

    @PostMapping("/{id}/clore")
    public FicheReparation clore(@PathVariable Long id) { return service.clore(id); }

    @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> exportPdf() {
        byte[] data = exportService.exporterListeFichesPdf(service.findAll());
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"fiches-reparation.pdf\"")
            .contentType(MediaType.APPLICATION_PDF).body(data);
    }

    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportExcel() {
        byte[] data = exportService.exporterListeFichesExcel(service.findAll());
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"fiches-reparation.xlsx\"")
            .contentType(MediaType.parseMediaType(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
            .body(data);
    }

    @GetMapping("/{id}/imprimer")
    public ResponseEntity<byte[]> imprimer(@PathVariable Long id) {
        byte[] data = exportService.imprimerFicheReparation(service.findById(id));
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"fiche-reparation-" + id + ".pdf\"")
            .contentType(MediaType.APPLICATION_PDF).body(data);
    }
}
