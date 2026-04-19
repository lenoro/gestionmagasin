package com.gestionmagasin.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "bons_approvisionnement")
public class BonApprovisionnement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_bon", nullable = false, unique = true, length = 15)
    private String numeroBon;

    @Column(name = "date_bon", nullable = false)
    private LocalDate dateBon;

    @ManyToOne
    @JoinColumn(name = "fournisseur_id", nullable = false)
    private Produit fournisseur;

    @Column(name = "type_carburant", nullable = false, length = 10)
    @Enumerated(EnumType.STRING)
    private TypeCarburant typeCarburant;

    @Column(name = "quantite_litres", nullable = false, precision = 12, scale = 3)
    private BigDecimal quantiteLitres;

    @Column(name = "prix_unitaire", nullable = false, precision = 10, scale = 2)
    private BigDecimal prixUnitaire;

    @Column(name = "statut", nullable = false, length = 10)
    @Enumerated(EnumType.STRING)
    private StatutAppro statut = StatutAppro.BROUILLON;

    @Column(name = "observations", columnDefinition = "TEXT")
    private String observations;

    @Column(name = "created_at")
    private LocalDate createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNumeroBon() { return numeroBon; }
    public void setNumeroBon(String numeroBon) { this.numeroBon = numeroBon; }
    public LocalDate getDateBon() { return dateBon; }
    public void setDateBon(LocalDate dateBon) { this.dateBon = dateBon; }
    public Produit getFournisseur() { return fournisseur; }
    public void setFournisseur(Produit fournisseur) { this.fournisseur = fournisseur; }
    public TypeCarburant getTypeCarburant() { return typeCarburant; }
    public void setTypeCarburant(TypeCarburant typeCarburant) { this.typeCarburant = typeCarburant; }
    public BigDecimal getQuantiteLitres() { return quantiteLitres; }
    public void setQuantiteLitres(BigDecimal quantiteLitres) { this.quantiteLitres = quantiteLitres; }
    public BigDecimal getPrixUnitaire() { return prixUnitaire; }
    public void setPrixUnitaire(BigDecimal prixUnitaire) { this.prixUnitaire = prixUnitaire; }
    public StatutAppro getStatut() { return statut; }
    public void setStatut(StatutAppro statut) { this.statut = statut; }
    public String getObservations() { return observations; }
    public void setObservations(String observations) { this.observations = observations; }
    public LocalDate getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }
}
