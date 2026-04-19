package com.gestionmagasin.controller;

import com.gestionmagasin.model.BonDistribution;
import com.gestionmagasin.service.BonDistributionService;
import com.gestionmagasin.service.CarburantExportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bons-distribution")
@CrossOrigin(origins = "*")
public class BonDistributionController {

    private final BonDistributionService service;
    private final CarburantExportService exportService;

    public BonDistributionController(BonDistributionService service,
                                      CarburantExportService exportService) {
        this.service = service;
        this.exportService = exportService;
    }

    @GetMapping
    public List<BonDistribution> findAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public BonDistribution findById(@PathVariable Long id) { return service.findById(id); }

    @PostMapping
    public BonDistribution create(@RequestBody BonDistribution bon) { return service.creer(bon); }

    @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> exportPdf() {
        byte[] data = exportService.exporterListeDistribPdf(service.findAll());
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"bons-distribution.pdf\"")
            .contentType(MediaType.APPLICATION_PDF).body(data);
    }

    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportExcel() {
        byte[] data = exportService.exporterListeDistribExcel(service.findAll());
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"bons-distribution.xlsx\"")
            .contentType(MediaType.parseMediaType(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
            .body(data);
    }

    @GetMapping("/{id}/imprimer")
    public ResponseEntity<byte[]> imprimer(@PathVariable Long id) {
        byte[] data = exportService.imprimerBonDistrib(service.findById(id));
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"bon-distribution-" + id + ".pdf\"")
            .contentType(MediaType.APPLICATION_PDF).body(data);
    }
}
