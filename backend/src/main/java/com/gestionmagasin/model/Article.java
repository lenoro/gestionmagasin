package com.gestionmagasin.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "articles")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id", scope = Article.class)
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "article_code", nullable = false, unique = true, length = 20)
    private String articleCode;

    @Column(name = "article_name", nullable = false)
    private String articleName;

    @Column(name = "description")
    private String description;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "stock")
    private int stock;

    @Column(name = "categorie", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private CategorieArticle categorie = CategorieArticle.CONSOMMABLE;

    @ManyToOne
    @JoinColumn(name = "producer_id")
    private Produit producteur;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getArticleCode() { return articleCode; }
    public void setArticleCode(String articleCode) { this.articleCode = articleCode; }
    public String getArticleName() { return articleName; }
    public void setArticleName(String articleName) { this.articleName = articleName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
    public CategorieArticle getCategorie() { return categorie; }
    public void setCategorie(CategorieArticle categorie) { this.categorie = categorie; }
    public Produit getProducteur() { return producteur; }
    public void setProducteur(Produit producteur) { this.producteur = producteur; }
}