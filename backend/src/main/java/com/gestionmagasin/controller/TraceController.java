package com.gestionmagasin.controller;

import com.gestionmagasin.model.Trace;
import com.gestionmagasin.service.TraceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Lecture seule — les traces ne peuvent pas être modifiées ni supprimées.
 */
@RestController
@RequestMapping("/traces")
@RequiredArgsConstructor
public class TraceController {

    private final TraceService traceService;

    @GetMapping
    public List<Trace> getAll(
            @RequestParam(required = false) String entite,
            @RequestParam(required = false) String utilisateur,
            @RequestParam(required = false) String action) {

        if (entite      != null) return traceService.getByEntite(entite);
        if (utilisateur != null) return traceService.getByUtilisateur(utilisateur);
        if (action      != null) return traceService.getByAction(action);
        return traceService.getAll();
    }
}
