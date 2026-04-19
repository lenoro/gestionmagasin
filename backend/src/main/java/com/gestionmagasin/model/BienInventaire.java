package com.gestionmagasin.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "biens_inventaire")
public class BienInventaire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_inventaire", nullable = false, unique = true, length = 20)
    private String numeroInventaire;

    @Column(name = "designation", nullable = false)
    private String designation;

    @Column(name = "marque_modele")
    private String marqueModele;

    @Column(name = "date_acquisition", nullable = false)
    private LocalDate dateAcquisition;

    @Column(name = "prix_achat", nullable = false, precision = 12, scale = 2)
    private BigDecimal prixAchat;

    @ManyToOne
    @JoinColumn(name = "affectation_id")
    private Affectation affectation;

    @Column(name = "affectation_libre")
    private String affectationLibre;

    @Column(name = "etat_materiel", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private EtatMateriel etatMateriel;

    @Column(name = "observations", columnDefinition = "TEXT")
    private String observations;

    @Column(name = "statut", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private StatutBien statut = StatutBien.ACTIF;

    @Column(name = "created_at")
    private LocalDate createdAt;

    @OneToMany(mappedBy = "bien", cascade = CascadeType.ALL)
    private List<MouvementInventaire> mouvements;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNumeroInventaire() { return numeroInventaire; }
    public void setNumeroInventaire(String numeroInventaire) { this.numeroInventaire = numeroInventaire; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    public String getMarqueModele() { return marqueModele; }
    public void setMarqueModele(String marqueModele) { this.marqueModele = marqueModele; }
    public LocalDate getDateAcquisition() { return dateAcquisition; }
    public void setDateAcquisition(LocalDate dateAcquisition) { this.dateAcquisition = dateAcquisition; }
    public BigDecimal getPrixAchat() { return prixAchat; }
    public void setPrixAchat(BigDecimal prixAchat) { this.prixAchat = prixAchat; }
    public Affectation getAffectation() { return affectation; }
    public void setAffectation(Affectation affectation) { this.affectation = affectation; }
    public String getAffectationLibre() { return affectationLibre; }
    public void setAffectationLibre(String affectationLibre) { this.affectationLibre = affectationLibre; }
    public EtatMateriel getEtatMateriel() { return etatMateriel; }
    public void setEtatMateriel(EtatMateriel etatMateriel) { this.etatMateriel = etatMateriel; }
    public String getObservations() { return observations; }
    public void setObservations(String observations) { this.observations = observations; }
    public StatutBien getStatut() { return statut; }
    public void setStatut(StatutBien statut) { this.statut = statut; }
    public LocalDate getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }
    public List<MouvementInventaire> getMouvements() { return mouvements; }
    public void setMouvements(List<MouvementInventaire> mouvements) { this.mouvements = mouvements; }
}
