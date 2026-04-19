package com.gestionmagasin.service;

import com.gestionmagasin.model.*;
import com.gestionmagasin.repository.BonDistributionRepository;
import com.gestionmagasin.repository.StockCarburantRepository;
import org.junit.jupiter.api.BeforeEach;
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
class BonDistributionServiceTest {

    @Mock BonDistributionRepository bonRepo;
    @Mock StockCarburantRepository stockRepo;
    @InjectMocks BonDistributionService service;

    private Vehicule vehicule;
    private StockCarburant stockGasoil;

    @BeforeEach
    void setup() {
        vehicule = new Vehicule();
        vehicule.setId(1L);
        vehicule.setImmatriculation("123 TUN 456");
        vehicule.setTypeCarburant(TypeCarburant.GASOIL);

        stockGasoil = new StockCarburant();
        stockGasoil.setTypeCarburant(TypeCarburant.GASOIL);
        stockGasoil.setQuantiteLitres(new BigDecimal("500"));
    }

    @Test
    void genererNumero_premierBon_retourneBD_YYYY_0001() {
        when(bonRepo.findMaxNumeroByPrefix("BD-2026-")).thenReturn(Optional.empty());
        assertThat(service.genererNumeroBon()).isEqualTo("BD-2026-0001");
    }

    @Test
    void genererNumero_apresExistant_incrementeSequence() {
        when(bonRepo.findMaxNumeroByPrefix("BD-2026-")).thenReturn(Optional.of("BD-2026-0007"));
        assertThat(service.genererNumeroBon()).isEqualTo("BD-2026-0008");
    }

    @Test
    void creer_stockSuffisant_decrementeEtEnregistre() {
        BonDistribution bon = bonAvec(TypeCarburant.GASOIL, new BigDecimal("100"));
        when(stockRepo.findByTypeCarburant(TypeCarburant.GASOIL)).thenReturn(Optional.of(stockGasoil));
        when(stockRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(bonRepo.findMaxNumeroByPrefix("BD-2026-")).thenReturn(Optional.empty());
        when(bonRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));

        BonDistribution result = service.creer(bon);

        assertThat(result.getNumeroBon()).isEqualTo("BD-2026-0001");
        assertThat(result.getCreatedAt()).isEqualTo(LocalDate.now());
        assertThat(stockGasoil.getQuantiteLitres()).isEqualByComparingTo(new BigDecimal("400")); // 500 - 100
    }

    @Test
    void creer_stockInsuffisant_leveException() {
        stockGasoil.setQuantiteLitres(new BigDecimal("10"));
        BonDistribution bon = bonAvec(TypeCarburant.GASOIL, new BigDecimal("100"));
        when(stockRepo.findByTypeCarburant(TypeCarburant.GASOIL)).thenReturn(Optional.of(stockGasoil));

        assertThatThrownBy(() -> service.creer(bon))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("GASOIL");
    }

    @Test
    void creer_stockInexistant_leveException() {
        BonDistribution bon = bonAvec(TypeCarburant.ESSENCE, new BigDecimal("50"));
        when(stockRepo.findByTypeCarburant(TypeCarburant.ESSENCE)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.creer(bon))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("ESSENCE");
    }

    private BonDistribution bonAvec(TypeCarburant type, BigDecimal litres) {
        BonDistribution bon = new BonDistribution();
        bon.setTypeCarburant(type);
        bon.setQuantiteLitres(litres);
        bon.setDateBon(LocalDate.now());
        bon.setVehicule(vehicule);
        return bon;
    }
}
