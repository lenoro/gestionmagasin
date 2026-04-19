package com.gestionmagasin.service;

import com.gestionmagasin.model.*;
import com.gestionmagasin.repository.BonApprovisionnementRepository;
import com.gestionmagasin.repository.StockCarburantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BonApprovisionnementService {

    private final BonApprovisionnementRepository bonRepo;
    private final StockCarburantRepository stockRepo;

    public BonApprovisionnementService(BonApprovisionnementRepository bonRepo,
                                        StockCarburantRepository stockRepo) {
        this.bonRepo = bonRepo;
        this.stockRepo = stockRepo;
    }

    public String genererNumeroBon() {
        int annee = LocalDate.now().getYear();
        String prefix = "BC-" + annee + "-";
        Optional<String> max = bonRepo.findMaxNumeroByPrefix(prefix);
        int seq = max.map(s -> Integer.parseInt(s.substring(prefix.length())) + 1).orElse(1);
        return String.format("%s%04d", prefix, seq);
    }

    public BonApprovisionnement creer(BonApprovisionnement bon) {
        bon.setNumeroBon(genererNumeroBon());
        bon.setStatut(StatutAppro.BROUILLON);
        bon.setCreatedAt(LocalDate.now());
        return bonRepo.save(bon);
    }

    public BonApprovisionnement valider(Long id) {
        BonApprovisionnement bon = bonRepo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Bon introuvable : " + id));
        if (bon.getStatut() == StatutAppro.VALIDE) {
            throw new IllegalStateException("Ce bon est déjà validé");
        }
        StockCarburant stock = getOrCreateStock(bon.getTypeCarburant());
        stock.setQuantiteLitres(stock.getQuantiteLitres().add(bon.getQuantiteLitres()));
        stockRepo.save(stock);
        bon.setStatut(StatutAppro.VALIDE);
        return bonRepo.save(bon);
    }

    public List<BonApprovisionnement> findAll() {
        return bonRepo.findAll();
    }

    public BonApprovisionnement findById(Long id) {
        return bonRepo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Bon introuvable : " + id));
    }

    public StockCarburant getOrCreateStock(TypeCarburant type) {
        return stockRepo.findByTypeCarburant(type).orElseGet(() -> {
            StockCarburant s = new StockCarburant();
            s.setTypeCarburant(type);
            s.setQuantiteLitres(BigDecimal.ZERO);
            return stockRepo.save(s);
        });
    }
}
