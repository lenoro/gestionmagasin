package com.gestionmagasin.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "retours")
public class Retour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "facture_id")
    private Facture facture;

    @Column(name = "date_retour", nullable = false)
    private LocalDate dateRetour;

    @Column(name = "motif")
    private String motif;

    // EN_ATTENTE, ACCEPTE, REFUSE
    @Column(name = "statut", length = 20)
    private String statut;

    @OneToMany(mappedBy = "retour", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RetourItem> items;

    // getters & setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public Facture getFacture() { return facture; }
    public void setFacture(Facture facture) { this.facture = facture; }
    public LocalDate getDateRetour() { return dateRetour; }
    public void setDateRetour(LocalDate dateRetour) { this.dateRetour = dateRetour; }
    public String getMotif() { return motif; }
    public void setMotif(String motif) { this.motif = motif; }
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
    public List<RetourItem> getItems() { return items; }
    public void setItems(List<RetourItem> items) { this.items = items; }
}
