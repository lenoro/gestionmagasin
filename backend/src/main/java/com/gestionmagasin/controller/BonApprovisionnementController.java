package com.gestionmagasin.controller;

import com.gestionmagasin.model.BonApprovisionnement;
import com.gestionmagasin.service.BonApprovisionnementService;
import com.gestionmagasin.service.CarburantExportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bons-approvisionnement")
@CrossOrigin(origins = "*")
public class BonApprovisionnementController {

    private final BonApprovisionnementService service;
    private final CarburantExportService exportService;

    public BonApprovisionnementController(BonApprovisionnementService service,
                                           CarburantExportService exportService) {
        this.service = service;
        this.exportService = exportService;
    }

    @GetMapping
    public List<BonApprovisionnement> findAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public BonApprovisionnement findById(@PathVariable Long id) { return service.findById(id); }

    @PostMapping
    public BonApprovisionnement create(@RequestBody BonApprovisionnement bon) { return service.creer(bon); }

    @PostMapping("/{id}/valider")
    public BonApprovisionnement valider(@PathVariable Long id) { return service.valider(id); }

    @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> exportPdf() {
        byte[] data = exportService.exporterListeApproPdf(service.findAll());
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"bons-approvisionnement.pdf\"")
            .contentType(MediaType.APPLICATION_PDF).body(data);
    }

    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportExcel() {
        byte[] data = exportService.exporterListeApproExcel(service.findAll());
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"bons-approvisionnement.xlsx\"")
            .contentType(MediaType.parseMediaType(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
            .body(data);
    }

    @GetMapping("/{id}/imprimer")
    public ResponseEntity<byte[]> imprimer(@PathVariable Long id) {
        byte[] data = exportService.imprimerBonAppro(service.findById(id));
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"bon-appro-" + id + ".pdf\"")
            .contentType(MediaType.APPLICATION_PDF).body(data);
    }
}
