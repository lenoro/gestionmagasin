package com.gestionmagasin.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "appro_items")
public class ApprovisionnementItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "appro_id", nullable = false)
    private Approvisionnement approvisionnement;

    @ManyToOne
    @JoinColumn(name = "article_id", nullable = false)
    private Article article;

    @Column(nullable = false)
    private int quantite;

    @Column(name = "prix_achat")
    private double prixAchat;

    // getters & setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public Approvisionnement getApprovisionnement() { return approvisionnement; }
    public void setApprovisionnement(Approvisionnement approvisionnement) { this.approvisionnement = approvisionnement; }
    public Article getArticle() { return article; }
    public void setArticle(Article article) { this.article = article; }
    public int getQuantite() { return quantite; }
    public void setQuantite(int quantite) { this.quantite = quantite; }
    public double getPrixAchat() { return prixAchat; }
    public void setPrixAchat(double prixAchat) { this.prixAchat = prixAchat; }
}
