package com.gestionmagasin.model;

import jakarta.persistence.*;

@Entity
@Table(name = "stock_articles")
public class StockArticle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 30)
    private String reference;

    @Column(nullable = false)
    private String designation;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "famille_id")
    private Famille famille;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "unite_id")
    private Unite unite;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fournisseur_prefere_id")
    private Fournisseur fournisseurPrefere;

    @Column
    private Double prixAchatMoyen;

    @Column
    private Double prixUnitaire;

    @Column
    private Double stockActuel = 0.0;

    @Column
    private Double stockMinimum;

    @Column
    private Double stockMaximum;

    @Column
    private String emplacement;

    @Column
    private String typeArticle;

    @Column
    private String categorie;

    @Column
    private Boolean actif = true;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Famille getFamille() { return famille; }
    public void setFamille(Famille famille) { this.famille = famille; }
    public Unite getUnite() { return unite; }
    public void setUnite(Unite unite) { this.unite = unite; }
    public Fournisseur getFournisseurPrefere() { return fournisseurPrefere; }
    public void setFournisseurPrefere(Fournisseur fournisseurPrefere) { this.fournisseurPrefere = fournisseurPrefere; }
    public Double getPrixAchatMoyen() { return prixAchatMoyen; }
    public void setPrixAchatMoyen(Double prixAchatMoyen) { this.prixAchatMoyen = prixAchatMoyen; }
    public Double getPrixUnitaire() { return prixUnitaire; }
    public void setPrixUnitaire(Double prixUnitaire) { this.prixUnitaire = prixUnitaire; }
    public Double getStockActuel() { return stockActuel; }
    public void setStockActuel(Double stockActuel) { this.stockActuel = stockActuel; }
    public Double getStockMinimum() { return stockMinimum; }
    public void setStockMinimum(Double stockMinimum) { this.stockMinimum = stockMinimum; }
    public Double getStockMaximum() { return stockMaximum; }
    public void setStockMaximum(Double stockMaximum) { this.stockMaximum = stockMaximum; }
    public String getEmplacement() { return emplacement; }
    public void setEmplacement(String emplacement) { this.emplacement = emplacement; }
    public String getTypeArticle() { return typeArticle; }
    public void setTypeArticle(String typeArticle) { this.typeArticle = typeArticle; }
    public String getCategorie() { return categorie; }
    public void setCategorie(String categorie) { this.categorie = categorie; }
    public Boolean getActif() { return actif; }
    public void setActif(Boolean actif) { this.actif = actif; }
}
