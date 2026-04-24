package com.gestionmagasin.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "stock_bons_entree")
public class BonEntreeStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String numero;

    @Column(nullable = false)
    private LocalDate dateEntree;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fournisseur_id")
    private Fournisseur fournisseur;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "depot_id")
    private Depot depot;

    @Column
    private String numeroBLFournisseur;

    @Column
    private String agentReception;

    @Column
    private String statut = "BROUILLON";

    @Column(columnDefinition = "TEXT")
    private String notes;

    @OneToMany(mappedBy = "bon", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<LigneBonEntreeStock> lignes = new ArrayList<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    public LocalDate getDateEntree() { return dateEntree; }
    public void setDateEntree(LocalDate dateEntree) { this.dateEntree = dateEntree; }
    public Fournisseur getFournisseur() { return fournisseur; }
    public void setFournisseur(Fournisseur fournisseur) { this.fournisseur = fournisseur; }
    public Depot getDepot() { return depot; }
    public void setDepot(Depot depot) { this.depot = depot; }
    public String getNumeroBLFournisseur() { return numeroBLFournisseur; }
    public void setNumeroBLFournisseur(String numeroBLFournisseur) { this.numeroBLFournisseur = numeroBLFournisseur; }
    public String getAgentReception() { return agentReception; }
    public void setAgentReception(String agentReception) { this.agentReception = agentReception; }
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public List<LigneBonEntreeStock> getLignes() { return lignes; }
    public void setLignes(List<LigneBonEntreeStock> lignes) { this.lignes = lignes; }
}
