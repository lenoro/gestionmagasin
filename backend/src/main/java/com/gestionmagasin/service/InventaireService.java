package com.gestionmagasin.service;

import com.gestionmagasin.model.*;
import com.gestionmagasin.repository.AffectationRepository;
import com.gestionmagasin.repository.BienInventaireRepository;
import com.gestionmagasin.repository.MouvementInventaireRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class InventaireService {

    private final BienInventaireRepository bienRepo;
    private final MouvementInventaireRepository mouvementRepo;
    private final AffectationRepository affectationRepo;

    public InventaireService(BienInventaireRepository bienRepo,
                             MouvementInventaireRepository mouvementRepo,
                             AffectationRepository affectationRepo) {
        this.bienRepo = bienRepo;
        this.mouvementRepo = mouvementRepo;
        this.affectationRepo = affectationRepo;
    }

    public String genererNumeroInventaire() {
        int annee = LocalDate.now().getYear();
        String prefix = "INV-" + annee + "-";
        Optional<String> maxNumero = bienRepo.findMaxNumeroByPrefix(prefix);

        int sequence = 1;
        if (maxNumero.isPresent()) {
            String dernierNumero = maxNumero.get();
            String seqStr = dernierNumero.substring(prefix.length());
            sequence = Integer.parseInt(seqStr) + 1;
        }

        return String.format("%s%04d", prefix, sequence);
    }

    public BienInventaire creer(BienInventaire bien) {
        if (bien.getAffectation() == null && (bien.getAffectationLibre() == null || bien.getAffectationLibre().isBlank())) {
            throw new IllegalArgumentException("L'affectation est obligatoire (liste ou texte libre)");
        }
        bien.setNumeroInventaire(genererNumeroInventaire());
        bien.setStatut(StatutBien.ACTIF);
        bien.setCreatedAt(LocalDate.now());
        return bienRepo.save(bien);
    }

    public BienInventaire modifier(Long id, BienInventaire data) {
        BienInventaire bien = bienRepo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Bien introuvable : " + id));
        bien.setDesignation(data.getDesignation());
        bien.setMarqueModele(data.getMarqueModele());
        bien.setDateAcquisition(data.getDateAcquisition());
        bien.setPrixAchat(data.getPrixAchat());
        bien.setEtatMateriel(data.getEtatMateriel());
        bien.setObservations(data.getObservations());
        return bienRepo.save(bien);
    }

    public List<BienInventaire> findAll() {
        return bienRepo.findAll();
    }

    public BienInventaire findById(Long id) {
        return bienRepo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Bien introuvable : " + id));
    }

    public List<MouvementInventaire> findMouvements(Long bienId) {
        return mouvementRepo.findByBienIdOrderByDateOperationDesc(bienId);
    }

    public BienInventaire transferer(Long id, Long affectationId, String affectationLibre, String motif, String visa) {
        BienInventaire bien = bienRepo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Bien introuvable : " + id));

        if (bien.getStatut() == StatutBien.REFORME) {
            throw new IllegalStateException("Un bien réformé ne peut pas être transféré");
        }

        String ancienneAffectation = affectationLabel(bien);

        if (affectationId != null) {
            Affectation aff = affectationRepo.findById(affectationId)
                .orElseThrow(() -> new IllegalArgumentException("Affectation introuvable : " + affectationId));
            bien.setAffectation(aff);
            bien.setAffectationLibre(null);
        } else {
            bien.setAffectation(null);
            bien.setAffectationLibre(affectationLibre);
        }

        MouvementInventaire mouvement = new MouvementInventaire();
        mouvement.setBien(bien);
        mouvement.setTypeMouvement(TypeMouvement.TRANSFERT);
        mouvement.setDateOperation(LocalDate.now());
        mouvement.setAffectationSource(ancienneAffectation);
        mouvement.setAffectationDestination(affectationLabel(bien));
        mouvement.setMotif(motif);
        mouvement.setVisa(visa);
        mouvementRepo.save(mouvement);

        return bienRepo.save(bien);
    }

    public BienInventaire reformer(Long id, String motif, String visa) {
        BienInventaire bien = bienRepo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Bien introuvable : " + id));

        MouvementInventaire mouvement = new MouvementInventaire();
        mouvement.setBien(bien);
        mouvement.setTypeMouvement(TypeMouvement.REFORME);
        mouvement.setDateOperation(LocalDate.now());
        mouvement.setAffectationSource(affectationLabel(bien));
        mouvement.setMotif(motif);
        mouvement.setVisa(visa);
        mouvementRepo.save(mouvement);

        bien.setStatut(StatutBien.REFORME);
        return bienRepo.save(bien);
    }

    private String affectationLabel(BienInventaire bien) {
        if (bien.getAffectation() != null) return bien.getAffectation().getLibelle();
        if (bien.getAffectationLibre() != null) return bien.getAffectationLibre();
        return "";
    }
}
