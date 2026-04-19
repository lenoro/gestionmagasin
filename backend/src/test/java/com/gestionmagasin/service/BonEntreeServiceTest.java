package com.gestionmagasin.service;

import com.gestionmagasin.model.*;
import com.gestionmagasin.repository.ArticleRepository;
import com.gestionmagasin.repository.BonEntreeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BonEntreeServiceTest {

    @Mock BonEntreeRepository bonRepo;
    @Mock ArticleRepository articleRepo;
    @InjectMocks BonEntreeService service;

    private Article articleConsommable;
    private Article articleNonConsommable;

    @BeforeEach
    void setup() {
        articleConsommable = new Article();
        articleConsommable.setId(1L);
        articleConsommable.setArticleCode("ART-001");
        articleConsommable.setCategorie(CategorieArticle.CONSOMMABLE);
        articleConsommable.setStock(10);

        articleNonConsommable = new Article();
        articleNonConsommable.setId(2L);
        articleNonConsommable.setCategorie(CategorieArticle.NON_CONSOMMABLE);
        articleNonConsommable.setStock(5);
    }

    @Test
    void genererNumero_premierBon_retourneBE_YYYY_0001() {
        when(bonRepo.findMaxNumeroByPrefix("BE-2026-")).thenReturn(Optional.empty());
        assertThat(service.genererNumeroBon()).isEqualTo("BE-2026-0001");
    }

    @Test
    void genererNumero_apresExistant_incrementeSequence() {
        when(bonRepo.findMaxNumeroByPrefix("BE-2026-")).thenReturn(Optional.of("BE-2026-0005"));
        assertThat(service.genererNumeroBon()).isEqualTo("BE-2026-0006");
    }

    @Test
    void creer_bonValide_statBrouillon() {
        BonEntree bon = bonAvecLigne(articleConsommable, 5, new BigDecimal("100"));
        when(bonRepo.findMaxNumeroByPrefix("BE-2026-")).thenReturn(Optional.empty());
        when(bonRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));

        BonEntree result = service.creer(bon);

        assertThat(result.getNumeroBon()).isEqualTo("BE-2026-0001");
        assertThat(result.getStatut()).isEqualTo(StatutBonEntree.BROUILLON);
        assertThat(result.getCreatedAt()).isEqualTo(LocalDate.now());
    }

    @Test
    void creer_articleNonConsommable_leveException() {
        BonEntree bon = bonAvecLigne(articleNonConsommable, 2, new BigDecimal("50"));

        assertThatThrownBy(() -> service.creer(bon))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("CONSOMMABLE");
    }

    @Test
    void valider_bonBrouillon_incrementeStockEtPasseValide() {
        BonEntree bon = bonAvecLigne(articleConsommable, 5, new BigDecimal("100"));
        bon.setId(1L);
        bon.setStatut(StatutBonEntree.BROUILLON);

        when(bonRepo.findById(1L)).thenReturn(Optional.of(bon));
        when(bonRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(articleRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));

        BonEntree result = service.valider(1L);

        assertThat(result.getStatut()).isEqualTo(StatutBonEntree.VALIDE);
        assertThat(articleConsommable.getStock()).isEqualTo(15); // 10 + 5
    }

    @Test
    void valider_bonDejaValide_leveException() {
        BonEntree bon = new BonEntree();
        bon.setId(1L);
        bon.setStatut(StatutBonEntree.VALIDE);
        bon.setLignes(new ArrayList<>());

        when(bonRepo.findById(1L)).thenReturn(Optional.of(bon));

        assertThatThrownBy(() -> service.valider(1L))
            .isInstanceOf(IllegalStateException.class)
            .hasMessage("Ce bon est déjà validé");
    }

    private BonEntree bonAvecLigne(Article article, int quantite, BigDecimal prix) {
        LigneBonEntree ligne = new LigneBonEntree();
        ligne.setArticle(article);
        ligne.setQuantite(quantite);
        ligne.setPrixUnitaire(prix);

        BonEntree bon = new BonEntree();
        bon.setTypeBon(TypeBonEntree.COMMANDE_FOURNISSEUR);
        bon.setDateBon(LocalDate.now());
        bon.setLignes(List.of(ligne));
        return bon;
    }
}
