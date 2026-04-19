package com.gestionmagasin.controller;

import com.gestionmagasin.dto.ApprouverRequest;
import com.gestionmagasin.dto.RejeterRequest;
import com.gestionmagasin.model.BonSortie;
import com.gestionmagasin.service.BonSortieService;
import com.gestionmagasin.service.RgbiExportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bons-sortie")
@CrossOrigin(origins = "*")
public class BonSortieController {

    private final BonSortieService service;
    private final RgbiExportService exportService;

    public BonSortieController(BonSortieService service, RgbiExportService exportService) {
        this.service = service;
        this.exportService = exportService;
    }

    @GetMapping
    public List<BonSortie> findAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public BonSortie findById(@PathVariable Long id) { return service.findById(id); }

    @PostMapping
    public BonSortie create(@RequestBody BonSortie bon) { return service.creer(bon); }

    @PostMapping("/{id}/approuver")
    public BonSortie approuver(@PathVariable Long id, @RequestBody ApprouverRequest req) {
        return service.approuver(id, req.getVisaApprobateur());
    }

    @PostMapping("/{id}/rejeter")
    public BonSortie rejeter(@PathVariable Long id, @RequestBody RejeterRequest req) {
        return service.rejeter(id, req.getMotif());
    }

    @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> exportPdf() {
        byte[] data = exportService.exporterListeBonsSortiePdf(service.findAll());
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"bons-sortie.pdf\"")
            .contentType(MediaType.APPLICATION_PDF).body(data);
    }

    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportExcel() {
        byte[] data = exportService.exporterListeBonsSortieExcel(service.findAll());
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"bons-sortie.xlsx\"")
            .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
            .body(data);
    }

    @GetMapping("/{id}/imprimer")
    public ResponseEntity<byte[]> imprimer(@PathVariable Long id) {
        byte[] data = exportService.imprimerFicheBonSortie(service.findById(id));
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"bon-sortie-" + id + ".pdf\"")
            .contentType(MediaType.APPLICATION_PDF).body(data);
    }
}
