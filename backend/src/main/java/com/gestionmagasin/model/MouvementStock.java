package com.gestionmagasin.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "mouvements_stock")
public class MouvementStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "article_id", nullable = false)
    private Article article;

    // ENTREE, SORTIE, RETOUR_CLIENT, AJUSTEMENT
    @Column(name = "type_mouvement", nullable = false, length = 20)
    private String typeMouvement;

    @Column(nullable = false)
    private int quantite;

    @Column(name = "stock_avant")
    private int stockAvant;

    @Column(name = "stock_apres")
    private int stockApres;

    @Column(name = "reference", length = 100)
    private String reference;

    @Column(name = "date_mouvement", nullable = false)
    private LocalDate dateMouvement;

    @Column(name = "notes")
    private String notes;

    // getters & setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public Article getArticle() { return article; }
    public void setArticle(Article article) { this.article = article; }
    public String getTypeMouvement() { return typeMouvement; }
    public void setTypeMouvement(String typeMouvement) { this.typeMouvement = typeMouvement; }
    public int getQuantite() { return quantite; }
    public void setQuantite(int quantite) { this.quantite = quantite; }
    public int getStockAvant() { return stockAvant; }
    public void setStockAvant(int stockAvant) { this.stockAvant = stockAvant; }
    public int getStockApres() { return stockApres; }
    public void setStockApres(int stockApres) { this.stockApres = stockApres; }
    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }
    public LocalDate getDateMouvement() { return dateMouvement; }
    public void setDateMouvement(LocalDate dateMouvement) { this.dateMouvement = dateMouvement; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
