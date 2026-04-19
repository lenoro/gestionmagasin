package com.gestionmagasin.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "fiches_reparation")
public class FicheReparation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_fiche", nullable = false, unique = true, length = 15)
    private String numeroFiche;

    @ManyToOne
    @JoinColumn(name = "bien_id", nullable = false)
    private BienInventaire bien;

    @Column(name = "motif", nullable = false)
    private String motif;

    @Column(name = "statut", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private StatutReparation statut = StatutReparation.EN_ATTENTE;

    @Column(name = "reparateur")
    private String reparateur;

    @ManyToOne
    @JoinColumn(name = "fournisseur_id")
    private Produit fournisseur;

    @Column(name = "cout_reparation", precision = 12, scale = 2)
    private BigDecimal coutReparation;

    @Column(name = "date_envoi")
    private LocalDate dateEnvoi;

    @Column(name = "date_retour")
    private LocalDate dateRetour;

    @Column(name = "date_cloture")
    private LocalDate dateCloture;

    @Column(name = "observations", columnDefinition = "TEXT")
    private String observations;

    @OneToMany(mappedBy = "fiche", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LigneFicheReparation> lignes = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDate createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNumeroFiche() { return numeroFiche; }
    public void setNumeroFiche(String numeroFiche) { this.numeroFiche = numeroFiche; }
    public BienInventaire getBien() { return bien; }
    public void setBien(BienInventaire bien) { this.bien = bien; }
    public String getMotif() { return motif; }
    public void setMotif(String motif) { this.motif = motif; }
    public StatutReparation getStatut() { return statut; }
    public void setStatut(StatutReparation statut) { this.statut = statut; }
    public String getReparateur() { return reparateur; }
    public void setReparateur(String reparateur) { this.reparateur = reparateur; }
    public Produit getFournisseur() { return fournisseur; }
    public void setFournisseur(Produit fournisseur) { this.fournisseur = fournisseur; }
    public BigDecimal getCoutReparation() { return coutReparation; }
    public void setCoutReparation(BigDecimal coutReparation) { this.coutReparation = coutReparation; }
    public LocalDate getDateEnvoi() { return dateEnvoi; }
    public void setDateEnvoi(LocalDate dateEnvoi) { this.dateEnvoi = dateEnvoi; }
    public LocalDate getDateRetour() { return dateRetour; }
    public void setDateRetour(LocalDate dateRetour) { this.dateRetour = dateRetour; }
    public LocalDate getDateCloture() { return dateCloture; }
    public void setDateCloture(LocalDate dateCloture) { this.dateCloture = dateCloture; }
    public String getObservations() { return observations; }
    public void setObservations(String observations) { this.observations = observations; }
    public List<LigneFicheReparation> getLignes() { return lignes; }
    public void setLignes(List<LigneFicheReparation> lignes) { this.lignes = lignes; }
    public LocalDate getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }
}
