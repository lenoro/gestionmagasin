package com.gestionmagasin.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "stock_bons_sortie")
public class BonSortieStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String numero;

    @Column(nullable = false)
    private LocalDate dateSortie;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employe_id")
    private Employe employe;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "depot_id")
    private Depot depot;

    @Column
    private String agentMagasin;

    @Column
    private String statut = "BROUILLON";

    @Column
    private String motif;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @OneToMany(mappedBy = "bon", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<LigneBonSortieStock> lignes = new ArrayList<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    public LocalDate getDateSortie() { return dateSortie; }
    public void setDateSortie(LocalDate dateSortie) { this.dateSortie = dateSortie; }
    public Employe getEmploye() { return employe; }
    public void setEmploye(Employe employe) { this.employe = employe; }
    public Depot getDepot() { return depot; }
    public void setDepot(Depot depot) { this.depot = depot; }
    public String getAgentMagasin() { return agentMagasin; }
    public void setAgentMagasin(String agentMagasin) { this.agentMagasin = agentMagasin; }
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
    public String getMotif() { return motif; }
    public void setMotif(String motif) { this.motif = motif; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public List<LigneBonSortieStock> getLignes() { return lignes; }
    public void setLignes(List<LigneBonSortieStock> lignes) { this.lignes = lignes; }
}
