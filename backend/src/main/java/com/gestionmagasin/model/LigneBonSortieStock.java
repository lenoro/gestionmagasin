package com.gestionmagasin.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "stock_lignes_bon_sortie")
public class LigneBonSortieStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "bon_id", nullable = false)
    @JsonIgnore
    private BonSortieStock bon;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "article_id")
    private StockArticle produit;

    @Column(nullable = false)
    private Double quantiteDemandee;

    @Column
    private Double quantiteServie;

    @Column
    private Double prixUnitaire;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public BonSortieStock getBon() { return bon; }
    public void setBon(BonSortieStock bon) { this.bon = bon; }
    public StockArticle getProduit() { return produit; }
    public void setProduit(StockArticle produit) { this.produit = produit; }
    public Double getQuantiteDemandee() { return quantiteDemandee; }
    public void setQuantiteDemandee(Double quantiteDemandee) { this.quantiteDemandee = quantiteDemandee; }
    public Double getQuantiteServie() { return quantiteServie; }
    public void setQuantiteServie(Double quantiteServie) { this.quantiteServie = quantiteServie; }
    public Double getPrixUnitaire() { return prixUnitaire; }
    public void setPrixUnitaire(Double prixUnitaire) { this.prixUnitaire = prixUnitaire; }
}
