package com.gestionmagasin.controller;

import com.gestionmagasin.model.BonEntree;
import com.gestionmagasin.service.BonEntreeService;
import com.gestionmagasin.service.RgbiExportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bons-entree")
@CrossOrigin(origins = "*")
public class BonEntreeController {

    private final BonEntreeService service;
    private final RgbiExportService exportService;

    public BonEntreeController(BonEntreeService service, RgbiExportService exportService) {
        this.service = service;
        this.exportService = exportService;
    }

    @GetMapping
    public List<BonEntree> findAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public BonEntree findById(@PathVariable Long id) { return service.findById(id); }

    @PostMapping
    public BonEntree create(@RequestBody BonEntree bon) { return service.creer(bon); }

    @PostMapping("/{id}/valider")
    public BonEntree valider(@PathVariable Long id) { return service.valider(id); }

    @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> exportPdf() {
        byte[] data = exportService.exporterListeBonsEntreePdf(service.findAll());
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"bons-entree.pdf\"")
            .contentType(MediaType.APPLICATION_PDF).body(data);
    }

    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportExcel() {
        byte[] data = exportService.exporterListeBonsEntreeExcel(service.findAll());
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"bons-entree.xlsx\"")
            .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
            .body(data);
    }

    @GetMapping("/{id}/imprimer")
    public ResponseEntity<byte[]> imprimer(@PathVariable Long id) {
        byte[] data = exportService.imprimerFicheBonEntree(service.findById(id));
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"bon-entree-" + id + ".pdf\"")
            .contentType(MediaType.APPLICATION_PDF).body(data);
    }
}
