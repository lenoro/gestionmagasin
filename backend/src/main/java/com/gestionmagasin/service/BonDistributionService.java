package com.gestionmagasin.service;

import com.gestionmagasin.model.*;
import com.gestionmagasin.repository.BonDistributionRepository;
import com.gestionmagasin.repository.StockCarburantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BonDistributionService {

    private final BonDistributionRepository bonRepo;
    private final StockCarburantRepository stockRepo;

    public BonDistributionService(BonDistributionRepository bonRepo,
                                   StockCarburantRepository stockRepo) {
        this.bonRepo = bonRepo;
        this.stockRepo = stockRepo;
    }

    public String genererNumeroBon() {
        int annee = LocalDate.now().getYear();
        String prefix = "BD-" + annee + "-";
        Optional<String> max = bonRepo.findMaxNumeroByPrefix(prefix);
        int seq = max.map(s -> Integer.parseInt(s.substring(prefix.length())) + 1).orElse(1);
        return String.format("%s%04d", prefix, seq);
    }

    public BonDistribution creer(BonDistribution bon) {
        StockCarburant stock = stockRepo.findByTypeCarburant(bon.getTypeCarburant())
            .orElseThrow(() -> new IllegalStateException(
                "Stock insuffisant en : " + bon.getTypeCarburant()));
        if (stock.getQuantiteLitres().compareTo(bon.getQuantiteLitres()) < 0) {
            throw new IllegalStateException(
                "Stock insuffisant en : " + bon.getTypeCarburant());
        }
        stock.setQuantiteLitres(stock.getQuantiteLitres().subtract(bon.getQuantiteLitres()));
        stockRepo.save(stock);
        bon.setNumeroBon(genererNumeroBon());
        bon.setCreatedAt(LocalDate.now());
        return bonRepo.save(bon);
    }

    public List<BonDistribution> findAll() {
        return bonRepo.findAll();
    }

    public BonDistribution findById(Long id) {
        return bonRepo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Bon introuvable : " + id));
    }
}
