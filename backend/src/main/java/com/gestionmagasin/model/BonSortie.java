package com.gestionmagasin.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bons_sortie_inventaire")
public class BonSortie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_bon", nullable = false, unique = true, length = 20)
    private String numeroBon;

    @Column(name = "type_bon", nullable = false, length = 30)
    @Enumerated(EnumType.STRING)
    private TypeBonSortie typeBon;

    @Column(name = "date_bon", nullable = false)
    private LocalDate dateBon;

    @ManyToOne
    @JoinColumn(name = "service_destination_id", nullable = false)
    private Affectation serviceDestination;

    @Column(name = "statut", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private StatutBonSortie statut;

    @Column(name = "visa_magasinier")
    private String visaMagasinier;

    @Column(name = "visa_approbateur")
    private String visaApprobateur;

    @Column(name = "observations", columnDefinition = "TEXT")
    private String observations;

    @Column(name = "created_at")
    private LocalDate createdAt;

    @OneToMany(mappedBy = "bon", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LigneBonSortie> lignes = new ArrayList<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNumeroBon() { return numeroBon; }
    public void setNumeroBon(String numeroBon) { this.numeroBon = numeroBon; }
    public TypeBonSortie getTypeBon() { return typeBon; }
    public void setTypeBon(TypeBonSortie typeBon) { this.typeBon = typeBon; }
    public LocalDate getDateBon() { return dateBon; }
    public void setDateBon(LocalDate dateBon) { this.dateBon = dateBon; }
    public Affectation getServiceDestination() { return serviceDestination; }
    public void setServiceDestination(Affectation serviceDestination) { this.serviceDestination = serviceDestination; }
    public StatutBonSortie getStatut() { return statut; }
    public void setStatut(StatutBonSortie statut) { this.statut = statut; }
    public String getVisaMagasinier() { return visaMagasinier; }
    public void setVisaMagasinier(String visaMagasinier) { this.visaMagasinier = visaMagasinier; }
    public String getVisaApprobateur() { return visaApprobateur; }
    public void setVisaApprobateur(String visaApprobateur) { this.visaApprobateur = visaApprobateur; }
    public String getObservations() { return observations; }
    public void setObservations(String observations) { this.observations = observations; }
    public LocalDate getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }
    public List<LigneBonSortie> getLignes() { return lignes; }
    public void setLignes(List<LigneBonSortie> lignes) { this.lignes = lignes; }
}
