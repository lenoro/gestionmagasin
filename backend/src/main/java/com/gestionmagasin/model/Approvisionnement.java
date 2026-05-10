package com.gestionmagasin.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "approvisionnements")
public class Approvisionnement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "producteur_id")
    private Produit producteur;

    @Column(name = "date_appro", nullable = false)
    private LocalDate dateAppro;

    @Column(name = "reference", length = 100)
    private String reference;

    // EN_ATTENTE, RECU
    @Column(name = "statut", length = 20)
    private String statut;

    @Column(name = "notes")
    private String notes;

    @OneToMany(mappedBy = "approvisionnement", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ApprovisionnementItem> items;

    // getters & setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public Produit getProducteur() { return producteur; }
    public void setProducteur(Produit producteur) { this.producteur = producteur; }
    public LocalDate getDateAppro() { return dateAppro; }
    public void setDateAppro(LocalDate dateAppro) { this.dateAppro = dateAppro; }
    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public List<ApprovisionnementItem> getItems() { return items; }
    public void setItems(List<ApprovisionnementItem> items) { this.items = items; }
}
