package com.gestionmagasin.service;

import com.gestionmagasin.model.*;
import com.gestionmagasin.repository.ArticleRepository;
import com.gestionmagasin.repository.BonSortieRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BonSortieServiceTest {

    @Mock BonSortieRepository bonRepo;
    @Mock ArticleRepository articleRepo;
    @InjectMocks BonSortieService service;

    private Article article;

    @BeforeEach
    void setup() {
        article = new Article();
        article.setId(1L);
        article.setArticleCode("ART-001");
        article.setCategorie(CategorieArticle.CONSOMMABLE);
        article.setStock(20);
    }

    @Test
    void genererNumero_premierBon_retourneBS_YYYY_0001() {
        when(bonRepo.findMaxNumeroByPrefix("BS-2026-")).thenReturn(Optional.empty());
        assertThat(service.genererNumeroBon()).isEqualTo("BS-2026-0001");
    }

    @Test
    void creer_demande_statEnAttente() {
        BonSortie bon = bonAvecLigne(TypeBonSortie.DEMANDE, 5);
        when(bonRepo.findMaxNumeroByPrefix("BS-2026-")).thenReturn(Optional.empty());
        when(bonRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));

        BonSortie result = service.creer(bon);

        assertThat(result.getStatut()).isEqualTo(StatutBonSortie.EN_ATTENTE);
        assertThat(article.getStock()).isEqualTo(20); // stock non touché
    }

    @Test
    void creer_sortieDirecte_statTraiteEtDecrementeStock() {
        BonSortie bon = bonAvecLigne(TypeBonSortie.SORTIE_DIRECTE, 8);
        when(bonRepo.findMaxNumeroByPrefix("BS-2026-")).thenReturn(Optional.empty());
        when(bonRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(articleRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));

        BonSortie result = service.creer(bon);

        assertThat(result.getStatut()).isEqualTo(StatutBonSortie.TRAITE);
        assertThat(article.getStock()).isEqualTo(12); // 20 - 8
    }

    @Test
    void creer_sortieDirecte_stockInsuffisant_leveException() {
        BonSortie bon = bonAvecLigne(TypeBonSortie.SORTIE_DIRECTE, 25); // > 20

        assertThatThrownBy(() -> service.creer(bon))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("ART-001");
    }

    @Test
    void approuver_demandeEnAttente_passeTraiteEtDecrementeStock() {
        BonSortie bon = bonAvecLigne(TypeBonSortie.DEMANDE, 5);
        bon.setId(1L);
        bon.setStatut(StatutBonSortie.EN_ATTENTE);

        when(bonRepo.findById(1L)).thenReturn(Optional.of(bon));
        when(bonRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(articleRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));

        BonSortie result = service.approuver(1L, "Chef Service");

        assertThat(result.getStatut()).isEqualTo(StatutBonSortie.TRAITE);
        assertThat(result.getVisaApprobateur()).isEqualTo("Chef Service");
        assertThat(article.getStock()).isEqualTo(15); // 20 - 5
    }

    @Test
    void approuver_stockInsuffisant_leveException() {
        BonSortie bon = bonAvecLigne(TypeBonSortie.DEMANDE, 25); // > 20
        bon.setId(1L);
        bon.setStatut(StatutBonSortie.EN_ATTENTE);

        when(bonRepo.findById(1L)).thenReturn(Optional.of(bon));

        assertThatThrownBy(() -> service.approuver(1L, "Chef"))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("ART-001");
    }

    @Test
    void rejeter_demandeEnAttente_passeRejete() {
        BonSortie bon = bonAvecLigne(TypeBonSortie.DEMANDE, 5);
        bon.setId(1L);
        bon.setStatut(StatutBonSortie.EN_ATTENTE);

        when(bonRepo.findById(1L)).thenReturn(Optional.of(bon));
        when(bonRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));

        BonSortie result = service.rejeter(1L, "Budget insuffisant");

        assertThat(result.getStatut()).isEqualTo(StatutBonSortie.REJETE);
        assertThat(article.getStock()).isEqualTo(20); // stock non touché
    }

    @Test
    void creer_articleNonConsommable_leveException() {
        article.setCategorie(CategorieArticle.NON_CONSOMMABLE);
        BonSortie bon = bonAvecLigne(TypeBonSortie.DEMANDE, 3);

        assertThatThrownBy(() -> service.creer(bon))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("CONSOMMABLE");
    }

    private BonSortie bonAvecLigne(TypeBonSortie type, int quantite) {
        LigneBonSortie ligne = new LigneBonSortie();
        ligne.setArticle(article);
        ligne.setQuantite(quantite);

        BonSortie bon = new BonSortie();
        bon.setTypeBon(type);
        bon.setDateBon(LocalDate.now());
        bon.setLignes(List.of(ligne));
        return bon;
    }
}
