package com.gestionmagasin.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "stock_lignes_bon_entree")
public class LigneBonEntreeStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "bon_id", nullable = false)
    @JsonIgnore
    private BonEntreeStock bon;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "article_id")
    private StockArticle produit;

    @Column(nullable = false)
    private Double quantite;

    @Column
    private Double prixUnitaire;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public BonEntreeStock getBon() { return bon; }
    public void setBon(BonEntreeStock bon) { this.bon = bon; }
    public StockArticle getProduit() { return produit; }
    public void setProduit(StockArticle produit) { this.produit = produit; }
    public Double getQuantite() { return quantite; }
    public void setQuantite(Double quantite) { this.quantite = quantite; }
    public Double getPrixUnitaire() { return prixUnitaire; }
    public void setPrixUnitaire(Double prixUnitaire) { this.prixUnitaire = prixUnitaire; }
}
