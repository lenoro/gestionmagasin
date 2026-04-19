package com.gestionmagasin.service;

import com.gestionmagasin.model.*;
import com.gestionmagasin.repository.ArticleRepository;
import com.gestionmagasin.repository.BienInventaireRepository;
import com.gestionmagasin.repository.FicheReparationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FicheReparationServiceTest {

    @Mock FicheReparationRepository ficheRepo;
    @Mock BienInventaireRepository bienRepo;
    @Mock ArticleRepository articleRepo;
    @InjectMocks FicheReparationService service;

    private BienInventaire bien;
    private Article articleConsommable;
    private Article articleNonConsommable;

    @BeforeEach
    void setup() {
        bien = new BienInventaire();
        bien.setId(10L);
        bien.setDesignation("Ordinateur");
        bien.setEtatMateriel(EtatMateriel.BON);

        articleConsommable = new Article();
        articleConsommable.setId(1L);
        articleConsommable.setArticleCode("PIECE-001");
        articleConsommable.setCategorie(CategorieArticle.CONSOMMABLE);
        articleConsommable.setStock(20);

        articleNonConsommable = new Article();
        articleNonConsommable.setId(2L);
        articleNonConsommable.setArticleCode("BIEN-002");
        articleNonConsommable.setCategorie(CategorieArticle.NON_CONSOMMABLE);
        articleNonConsommable.setStock(5);
    }

    @Test
    void genererNumero_premierFiche_retourneFR_YYYY_0001() {
        when(ficheRepo.findMaxNumeroByPrefix("FR-2026-")).thenReturn(Optional.empty());
        assertThat(service.genererNumeroFiche()).isEqualTo("FR-2026-0001");
    }

    @Test
    void genererNumero_apresExistant_incrementeSequence() {
        when(ficheRepo.findMaxNumeroByPrefix("FR-2026-")).thenReturn(Optional.of("FR-2026-0003"));
        assertThat(service.genererNumeroFiche()).isEqualTo("FR-2026-0004");
    }

    @Test
    void creer_ficheValide_statEnAttente_etMajEtatBien() {
        FicheReparation fiche = ficheAvecLigne(articleConsommable, 2);
        fiche.setBien(bien);

        when(ficheRepo.findMaxNumeroByPrefix("FR-2026-")).thenReturn(Optional.empty());
        when(ficheRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(bienRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));

        FicheReparation result = service.creer(fiche);

        assertThat(result.getNumeroFiche()).isEqualTo("FR-2026-0001");
        assertThat(result.getStatut()).isEqualTo(StatutReparation.EN_ATTENTE);
        assertThat(result.getBien().getEtatMateriel()).isEqualTo(EtatMateriel.EN_REPARATION);
        assertThat(result.getCreatedAt()).isNotNull();
    }

    @Test
    void creer_articleNonConsommable_leveException() {
        FicheReparation fiche = ficheAvecLigne(articleNonConsommable, 1);
        fiche.setBien(bien);

        assertThatThrownBy(() -> service.creer(fiche))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("CONSOMMABLE");
    }

    @Test
    void envoyer_depuisEnAttente_passageEtDate() {
        FicheReparation fiche = ficheEnStatut(StatutReparation.EN_ATTENTE);
        when(ficheRepo.findById(1L)).thenReturn(Optional.of(fiche));
        when(ficheRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));

        FicheReparation result = service.envoyer(1L);

        assertThat(result.getStatut()).isEqualTo(StatutReparation.ENVOYE_ATELIER);
        assertThat(result.getDateEnvoi()).isNotNull();
    }

    @Test
    void envoyer_horsSequence_leveException() {
        FicheReparation fiche = ficheEnStatut(StatutReparation.RETOURNE);
        when(ficheRepo.findById(1L)).thenReturn(Optional.of(fiche));

        assertThatThrownBy(() -> service.envoyer(1L))
            .isInstanceOf(IllegalStateException.class);
    }

    @Test
    void retourner_depuisEnvoyeAtelier_passageEtDate() {
        FicheReparation fiche = ficheEnStatut(StatutReparation.ENVOYE_ATELIER);
        when(ficheRepo.findById(1L)).thenReturn(Optional.of(fiche));
        when(ficheRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));

        FicheReparation result = service.retourner(1L);

        assertThat(result.getStatut()).isEqualTo(StatutReparation.RETOURNE);
        assertThat(result.getDateRetour()).isNotNull();
    }

    @Test
    void clore_decrementeStockEtPasseClos() {
        FicheReparation fiche = ficheEnStatut(StatutReparation.RETOURNE);
        LigneFicheReparation ligne = new LigneFicheReparation();
        ligne.setArticle(articleConsommable);
        ligne.setQuantite(3);
        fiche.setLignes(new ArrayList<>(List.of(ligne)));

        when(ficheRepo.findById(1L)).thenReturn(Optional.of(fiche));
        when(ficheRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(articleRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));

        FicheReparation result = service.clore(1L);

        assertThat(result.getStatut()).isEqualTo(StatutReparation.CLOS);
        assertThat(result.getDateCloture()).isNotNull();
        assertThat(articleConsommable.getStock()).isEqualTo(17); // 20 - 3
    }

    @Test
    void clore_stockInsuffisant_leveException() {
        articleConsommable.setStock(1);
        FicheReparation fiche = ficheEnStatut(StatutReparation.RETOURNE);
        LigneFicheReparation ligne = new LigneFicheReparation();
        ligne.setArticle(articleConsommable);
        ligne.setQuantite(5);
        fiche.setLignes(new ArrayList<>(List.of(ligne)));

        when(ficheRepo.findById(1L)).thenReturn(Optional.of(fiche));

        assertThatThrownBy(() -> service.clore(1L))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("PIECE-001");
    }

    // --- helpers ---

    private FicheReparation ficheAvecLigne(Article article, int quantite) {
        LigneFicheReparation ligne = new LigneFicheReparation();
        ligne.setArticle(article);
        ligne.setQuantite(quantite);

        FicheReparation fiche = new FicheReparation();
        fiche.setMotif("Panne écran");
        fiche.setLignes(new ArrayList<>(List.of(ligne)));
        return fiche;
    }

    private FicheReparation ficheEnStatut(StatutReparation statut) {
        FicheReparation fiche = new FicheReparation();
        fiche.setId(1L);
        fiche.setStatut(statut);
        fiche.setLignes(new ArrayList<>());
        fiche.setBien(bien);
        return fiche;
    }
}
