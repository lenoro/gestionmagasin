package com.gestionmagasin.service;

import com.gestionmagasin.model.*;
import com.gestionmagasin.repository.AffectationRepository;
import com.gestionmagasin.repository.BienInventaireRepository;
import com.gestionmagasin.repository.MouvementInventaireRepository;
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
class InventaireServiceTest {

    @Mock
    private BienInventaireRepository bienRepo;

    @Mock
    private MouvementInventaireRepository mouvementRepo;

    @Mock
    private AffectationRepository affectationRepo;

    @InjectMocks
    private InventaireService service;

    private BienInventaire bienActif;

    @BeforeEach
    void setup() {
        bienActif = new BienInventaire();
        bienActif.setId(1L);
        bienActif.setNumeroInventaire("INV-2026-0001");
        bienActif.setDesignation("Ordinateur Dell");
        bienActif.setDateAcquisition(LocalDate.of(2026, 1, 15));
        bienActif.setPrixAchat(new BigDecimal("85000"));
        bienActif.setEtatMateriel(EtatMateriel.BON);
        bienActif.setStatut(StatutBien.ACTIF);
        bienActif.setAffectationLibre("Bureau RH");
    }

    // --- Numérotation ---

    @Test
    void genererNumero_premierBien_retourneINV_YYYY_0001() {
        when(bienRepo.findMaxNumeroByPrefix("INV-2026-")).thenReturn(Optional.empty());

        String numero = service.genererNumeroInventaire();

        assertThat(numero).isEqualTo("INV-2026-0001");
    }

    @Test
    void genererNumero_apresExistant_incrementeSequence() {
        when(bienRepo.findMaxNumeroByPrefix("INV-2026-")).thenReturn(Optional.of("INV-2026-0003"));

        String numero = service.genererNumeroInventaire();

        assertThat(numero).isEqualTo("INV-2026-0004");
    }

    // --- Création ---

    @Test
    void creer_bienValide_sauvegardeAvecNumeroEtDate() {
        BienInventaire nouveau = new BienInventaire();
        nouveau.setDesignation("Imprimante HP");
        nouveau.setDateAcquisition(LocalDate.of(2026, 4, 17));
        nouveau.setPrixAchat(new BigDecimal("45000"));
        nouveau.setEtatMateriel(EtatMateriel.BON);
        nouveau.setAffectationLibre("Secrétariat");

        when(bienRepo.findMaxNumeroByPrefix("INV-2026-")).thenReturn(Optional.empty());
        when(bienRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));

        BienInventaire result = service.creer(nouveau);

        assertThat(result.getNumeroInventaire()).isEqualTo("INV-2026-0001");
        assertThat(result.getStatut()).isEqualTo(StatutBien.ACTIF);
        assertThat(result.getCreatedAt()).isEqualTo(LocalDate.now());
    }

    @Test
    void creer_sansAffectation_leveException() {
        BienInventaire nouveau = new BienInventaire();
        nouveau.setDesignation("Table");
        nouveau.setDateAcquisition(LocalDate.now());
        nouveau.setPrixAchat(new BigDecimal("10000"));
        nouveau.setEtatMateriel(EtatMateriel.BON);
        // affectation et affectationLibre tous les deux null

        assertThatThrownBy(() -> service.creer(nouveau))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("L'affectation est obligatoire (liste ou texte libre)");
    }

    // --- Transfert ---

    @Test
    void transferer_bienActif_creerMouvementEtMettreAJourAffectation() {
        when(bienRepo.findById(1L)).thenReturn(Optional.of(bienActif));
        when(bienRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(mouvementRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));

        BienInventaire result = service.transferer(1L, null, "Atelier B", "Déménagement service", "Chef Atelier");

        assertThat(result.getAffectationLibre()).isEqualTo("Atelier B");
        assertThat(result.getStatut()).isEqualTo(StatutBien.ACTIF);
        verify(mouvementRepo).save(argThat(m ->
            m.getTypeMouvement() == TypeMouvement.TRANSFERT &&
            m.getAffectationSource().equals("Bureau RH") &&
            m.getAffectationDestination().equals("Atelier B")
        ));
    }

    @Test
    void transferer_bienReforme_leveException() {
        bienActif.setStatut(StatutBien.REFORME);
        when(bienRepo.findById(1L)).thenReturn(Optional.of(bienActif));

        assertThatThrownBy(() -> service.transferer(1L, null, "Atelier C", "Test", "Chef"))
            .isInstanceOf(IllegalStateException.class)
            .hasMessage("Un bien réformé ne peut pas être transféré");
    }

    // --- Réforme ---

    @Test
    void reformer_bienActif_passeStatutEtCreeMouvement() {
        when(bienRepo.findById(1L)).thenReturn(Optional.of(bienActif));
        when(bienRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(mouvementRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));

        BienInventaire result = service.reformer(1L, "Hors d'usage total", "Directeur");

        assertThat(result.getStatut()).isEqualTo(StatutBien.REFORME);
        verify(mouvementRepo).save(argThat(m ->
            m.getTypeMouvement() == TypeMouvement.REFORME &&
            m.getMotif().equals("Hors d'usage total")
        ));
    }
}
