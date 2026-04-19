package com.gestionmagasin.controller;

import com.gestionmagasin.model.Ouvrage;
import com.gestionmagasin.service.BibliothequeExportService;
import com.gestionmagasin.service.OuvrageService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ouvrages")
@CrossOrigin(origins = "*")
public class OuvrageController {

    private final OuvrageService service;
    private final BibliothequeExportService exportService;

    public OuvrageController(OuvrageService service, BibliothequeExportService exportService) {
        this.service = service;
        this.exportService = exportService;
    }

    @GetMapping
    public List<Ouvrage> findAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public Ouvrage findById(@PathVariable Long id) { return service.findById(id); }

    @PostMapping
    public Ouvrage create(@RequestBody Ouvrage ouvrage) { return service.creer(ouvrage); }

    @PutMapping("/{id}")
    public Ouvrage update(@PathVariable Long id, @RequestBody Ouvrage ouvrage) {
        return service.modifier(id, ouvrage);
    }

    @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> exportPdf() {
        byte[] data = exportService.exporterListePdf(service.findAll());
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"ouvrages.pdf\"")
            .contentType(MediaType.APPLICATION_PDF).body(data);
    }

    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportExcel() {
        byte[] data = exportService.exporterListeExcel(service.findAll());
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"ouvrages.xlsx\"")
            .contentType(MediaType.parseMediaType(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
            .body(data);
    }
}
