package com.gestionmagasin.service;

import com.gestionmagasin.model.*;
import com.gestionmagasin.repository.BonApprovisionnementRepository;
import com.gestionmagasin.repository.StockCarburantRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BonApprovisionnementServiceTest {

    @Mock BonApprovisionnementRepository bonRepo;
    @Mock StockCarburantRepository stockRepo;
    @InjectMocks BonApprovisionnementService service;

    @Test
    void genererNumero_premierBon_retourneBC_YYYY_0001() {
        when(bonRepo.findMaxNumeroByPrefix("BC-2026-")).thenReturn(Optional.empty());
        assertThat(service.genererNumeroBon()).isEqualTo("BC-2026-0001");
    }

    @Test
    void genererNumero_apresExistant_incrementeSequence() {
        when(bonRepo.findMaxNumeroByPrefix("BC-2026-")).thenReturn(Optional.of("BC-2026-0003"));
        assertThat(service.genererNumeroBon()).isEqualTo("BC-2026-0004");
    }

    @Test
    void creer_bonValide_statBrouillon() {
        BonApprovisionnement bon = bonAvec(TypeCarburant.GASOIL, new BigDecimal("500"));
        when(bonRepo.findMaxNumeroByPrefix("BC-2026-")).thenReturn(Optional.empty());
        when(bonRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));

        BonApprovisionnement result = service.creer(bon);

        assertThat(result.getNumeroBon()).isEqualTo("BC-2026-0001");
        assertThat(result.getStatut()).isEqualTo(StatutAppro.BROUILLON);
        assertThat(result.getCreatedAt()).isEqualTo(LocalDate.now());
    }

    @Test
    void valider_stockExistant_incrementeStock() {
        BonApprovisionnement bon = bonAvec(TypeCarburant.GASOIL, new BigDecimal("200"));
        bon.setId(1L);
        bon.setStatut(StatutAppro.BROUILLON);

        StockCarburant stock = new StockCarburant();
        stock.setTypeCarburant(TypeCarburant.GASOIL);
        stock.setQuantiteLitres(new BigDecimal("100"));

        when(bonRepo.findById(1L)).thenReturn(Optional.of(bon));
        when(stockRepo.findByTypeCarburant(TypeCarburant.GASOIL)).thenReturn(Optional.of(stock));
        when(stockRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(bonRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));

        BonApprovisionnement result = service.valider(1L);

        assertThat(result.getStatut()).isEqualTo(StatutAppro.VALIDE);
        assertThat(stock.getQuantiteLitres()).isEqualByComparingTo(new BigDecimal("300")); // 100 + 200
    }

    @Test
    void valider_bonDejaValide_leveException() {
        BonApprovisionnement bon = bonAvec(TypeCarburant.GASOIL, new BigDecimal("100"));
        bon.setId(1L);
        bon.setStatut(StatutAppro.VALIDE);

        when(bonRepo.findById(1L)).thenReturn(Optional.of(bon));

        assertThatThrownBy(() -> service.valider(1L))
            .isInstanceOf(IllegalStateException.class)
            .hasMessage("Ce bon est déjà validé");
    }

    private BonApprovisionnement bonAvec(TypeCarburant type, BigDecimal litres) {
        BonApprovisionnement bon = new BonApprovisionnement();
        bon.setTypeCarburant(type);
        bon.setQuantiteLitres(litres);
        bon.setDateBon(LocalDate.now());
        bon.setPrixUnitaire(new BigDecimal("1.50"));
        Produit fournisseur = new Produit();
        fournisseur.setId(1L);
        bon.setFournisseur(fournisseur);
        return bon;
    }
}
