package com.gestionmagasin.model;

import jakarta.persistence.*;

@Entity
@Table(name = "lignes_fiche_reparation")
public class LigneFicheReparation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "fiche_id", nullable = false)
    private FicheReparation fiche;

    @ManyToOne
    @JoinColumn(name = "article_id", nullable = false)
    private Article article;

    @Column(name = "quantite", nullable = false)
    private int quantite;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public FicheReparation getFiche() { return fiche; }
    public void setFiche(FicheReparation fiche) { this.fiche = fiche; }
    public Article getArticle() { return article; }
    public void setArticle(Article article) { this.article = article; }
    public int getQuantite() { return quantite; }
    public void setQuantite(int quantite) { this.quantite = quantite; }
}
