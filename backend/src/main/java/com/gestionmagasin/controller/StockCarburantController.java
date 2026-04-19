package com.gestionmagasin.controller;

import com.gestionmagasin.model.StockCarburant;
import com.gestionmagasin.repository.StockCarburantRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock-carburant")
@CrossOrigin(origins = "*")
public class StockCarburantController {

    private final StockCarburantRepository repo;

    public StockCarburantController(StockCarburantRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<StockCarburant> findAll() { return repo.findAll(); }
}
