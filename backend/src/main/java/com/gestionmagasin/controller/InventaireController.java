package com.gestionmagasin.controller;

import com.gestionmagasin.dto.ReformeRequest;
import com.gestionmagasin.dto.TransfertRequest;
import com.gestionmagasin.model.BienInventaire;
import com.gestionmagasin.model.MouvementInventaire;
import com.gestionmagasin.service.ExportService;
import com.gestionmagasin.service.InventaireService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventaire")
@CrossOrigin(origins = "*")
public class InventaireController {

    private final InventaireService service;
    private final ExportService exportService;

    public InventaireController(InventaireService service, ExportService exportService) {
        this.service = service;
        this.exportService = exportService;
    }

    @GetMapping
    public List<BienInventaire> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public BienInventaire findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public BienInventaire create(@RequestBody BienInventaire bien) {
        return service.creer(bien);
    }

    @PutMapping("/{id}")
    public BienInventaire update(@PathVariable Long id, @RequestBody BienInventaire bien) {
        return service.modifier(id, bien);
    }

    @GetMapping("/{id}/mouvements")
    public List<MouvementInventaire> getMouvements(@PathVariable Long id) {
        return service.findMouvements(id);
    }

    @PostMapping("/{id}/transfert")
    public BienInventaire transferer(@PathVariable Long id, @RequestBody TransfertRequest req) {
        return service.transferer(id, req.getAffectationId(), req.getAffectationLibre(), req.getMotif(), req.getVisa());
    }

    @PostMapping("/{id}/reforme")
    public BienInventaire reformer(@PathVariable Long id, @RequestBody ReformeRequest req) {
        return service.reformer(id, req.getMotif(), req.getVisa());
    }

    @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> exportPdf() {
        byte[] pdf = exportService.exporterPdf(service.findAll());
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"registre-inventaire.pdf\"")
            .contentType(MediaType.APPLICATION_PDF)
            .body(pdf);
    }

    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportExcel() {
        byte[] excel = exportService.exporterExcel(service.findAll());
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"registre-inventaire.xlsx\"")
            .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
            .body(excel);
    }
}
