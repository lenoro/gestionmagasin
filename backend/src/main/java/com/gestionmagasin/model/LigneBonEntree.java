package com.gestionmagasin.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "lignes_bon_entree")
public class LigneBonEntree {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "bon_id", nullable = false)
    private BonEntree bon;

    @ManyToOne
    @JoinColumn(name = "article_id", nullable = false)
    private Article article;

    @Column(nullable = false)
    private int quantite;

    @Column(name = "prix_unitaire", nullable = false, precision = 10, scale = 2)
    private BigDecimal prixUnitaire;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public BonEntree getBon() { return bon; }
    public void setBon(BonEntree bon) { this.bon = bon; }
    public Article getArticle() { return article; }
    public void setArticle(Article article) { this.article = article; }
    public int getQuantite() { return quantite; }
    public void setQuantite(int quantite) { this.quantite = quantite; }
    public BigDecimal getPrixUnitaire() { return prixUnitaire; }
    public void setPrixUnitaire(BigDecimal prixUnitaire) { this.prixUnitaire = prixUnitaire; }
}
