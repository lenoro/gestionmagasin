package com.gestionmagasin.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "retour_items")
public class RetourItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "retour_id", nullable = false)
    private Retour retour;

    @ManyToOne
    @JoinColumn(name = "article_id", nullable = false)
    private Article article;

    @Column(nullable = false)
    private int quantite;

    @Column(name = "prix_unitaire")
    private double prixUnitaire;

    // getters & setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public Retour getRetour() { return retour; }
    public void setRetour(Retour retour) { this.retour = retour; }
    public Article getArticle() { return article; }
    public void setArticle(Article article) { this.article = article; }
    public int getQuantite() { return quantite; }
    public void setQuantite(int quantite) { this.quantite = quantite; }
    public double getPrixUnitaire() { return prixUnitaire; }
    public void setPrixUnitaire(double prixUnitaire) { this.prixUnitaire = prixUnitaire; }
}
