package com.gestionmagasin.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "bons_distribution")
public class BonDistribution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_bon", nullable = false, unique = true, length = 15)
    private String numeroBon;

    @Column(name = "date_bon", nullable = false)
    private LocalDate dateBon;

    @ManyToOne
    @JoinColumn(name = "vehicule_id", nullable = false)
    private Vehicule vehicule;

    @Column(name = "type_carburant", nullable = false, length = 10)
    @Enumerated(EnumType.STRING)
    private TypeCarburant typeCarburant;

    @Column(name = "quantite_litres", nullable = false, precision = 12, scale = 3)
    private BigDecimal quantiteLitres;

    @Column(name = "kilometrage")
    private Integer kilometrage;

    @Column(name = "chauffeur")
    private String chauffeur;

    @Column(name = "visa")
    private String visa;

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
    public Vehicule getVehicule() { return vehicule; }
    public void setVehicule(Vehicule vehicule) { this.vehicule = vehicule; }
    public TypeCarburant getTypeCarburant() { return typeCarburant; }
    public void setTypeCarburant(TypeCarburant typeCarburant) { this.typeCarburant = typeCarburant; }
    public BigDecimal getQuantiteLitres() { return quantiteLitres; }
    public void setQuantiteLitres(BigDecimal quantiteLitres) { this.quantiteLitres = quantiteLitres; }
    public Integer getKilometrage() { return kilometrage; }
    public void setKilometrage(Integer kilometrage) { this.kilometrage = kilometrage; }
    public String getChauffeur() { return chauffeur; }
    public void setChauffeur(String chauffeur) { this.chauffeur = chauffeur; }
    public String getVisa() { return visa; }
    public void setVisa(String visa) { this.visa = visa; }
    public String getObservations() { return observations; }
    public void setObservations(String observations) { this.observations = observations; }
    public LocalDate getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }
}
