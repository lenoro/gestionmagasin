package com.gestionmagasin.model;

import jakarta.persistence.*;

@Entity
@Table(name = "lignes_bon_sortie")
public class LigneBonSortie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "bon_id", nullable = false)
    private BonSortie bon;

    @ManyToOne
    @JoinColumn(name = "article_id", nullable = false)
    private Article article;

    @Column(nullable = false)
    private int quantite;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public BonSortie getBon() { return bon; }
    public void setBon(BonSortie bon) { this.bon = bon; }
    public Article getArticle() { return article; }
    public void setArticle(Article article) { this.article = article; }
    public int getQuantite() { return quantite; }
    public void setQuantite(int quantite) { this.quantite = quantite; }
}
