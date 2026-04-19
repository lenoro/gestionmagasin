package com.gestionmagasin.service;

import com.gestionmagasin.model.Domaine;
import com.gestionmagasin.model.Ouvrage;
import com.gestionmagasin.repository.OuvrageRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OuvrageServiceTest {

    @Mock OuvrageRepository repo;
    @InjectMocks OuvrageService service;

    @Test
    void genererNumero_premierOuvrage_retourneLIV_YYYY_0001() {
        when(repo.findMaxNumeroByPrefix("LIV-2026-")).thenReturn(Optional.empty());
        assertThat(service.genererNumeroOuvrage()).isEqualTo("LIV-2026-0001");
    }

    @Test
    void genererNumero_apresExistant_incrementeSequence() {
        when(repo.findMaxNumeroByPrefix("LIV-2026-")).thenReturn(Optional.of("LIV-2026-0003"));
        assertThat(service.genererNumeroOuvrage()).isEqualTo("LIV-2026-0004");
    }

    @Test
    void creer_setNumeroEtCreatedAt() {
        Ouvrage ouvrage = ouvrageValide();
        when(repo.findMaxNumeroByPrefix("LIV-2026-")).thenReturn(Optional.empty());
        when(repo.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Ouvrage result = service.creer(ouvrage);

        assertThat(result.getNumeroOuvrage()).isEqualTo("LIV-2026-0001");
        assertThat(result.getCreatedAt()).isEqualTo(LocalDate.now());
    }

    @Test
    void modifier_ouvrageExistant_misAJour() {
        Ouvrage existant = ouvrageValide();
        existant.setId(1L);
        existant.setNumeroOuvrage("LIV-2026-0001");
        existant.setCreatedAt(LocalDate.now());

        Ouvrage maj = new Ouvrage();
        maj.setTitre("Nouveau Titre");
        maj.setAuteur("Nouvel Auteur");
        maj.setDomaine(Domaine.DROIT);
        maj.setNbreExemplaires(3);

        when(repo.findById(1L)).thenReturn(Optional.of(existant));
        when(repo.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Ouvrage result = service.modifier(1L, maj);

        assertThat(result.getTitre()).isEqualTo("Nouveau Titre");
        assertThat(result.getAuteur()).isEqualTo("Nouvel Auteur");
        assertThat(result.getDomaine()).isEqualTo(Domaine.DROIT);
        assertThat(result.getNbreExemplaires()).isEqualTo(3);
        assertThat(result.getNumeroOuvrage()).isEqualTo("LIV-2026-0001"); // inchangé
    }

    private Ouvrage ouvrageValide() {
        Ouvrage o = new Ouvrage();
        o.setTitre("Introduction à Java");
        o.setAuteur("Jean Dupont");
        o.setDomaine(Domaine.INFORMATIQUE);
        o.setNbreExemplaires(2);
        return o;
    }
}
