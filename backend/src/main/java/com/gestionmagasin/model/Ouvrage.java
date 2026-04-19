package com.gestionmagasin.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "ouvrages")
public class Ouvrage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_ouvrage", nullable = false, unique = true, length = 15)
    private String numeroOuvrage;

    @Column(name = "titre", nullable = false)
    private String titre;

    @Column(name = "auteur", nullable = false)
    private String auteur;

    @Column(name = "isbn", length = 20)
    private String isbn;

    @Column(name = "editeur")
    private String editeur;

    @Column(name = "domaine", nullable = false, length = 15)
    @Enumerated(EnumType.STRING)
    private Domaine domaine;

    @Column(name = "annee_publication")
    private Integer anneePublication;

    @Column(name = "localisation")
    private String localisation;

    @Column(name = "nbre_exemplaires", nullable = false)
    private Integer nbreExemplaires = 1;

    @Column(name = "created_at")
    private LocalDate createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNumeroOuvrage() { return numeroOuvrage; }
    public void setNumeroOuvrage(String numeroOuvrage) { this.numeroOuvrage = numeroOuvrage; }
    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }
    public String getAuteur() { return auteur; }
    public void setAuteur(String auteur) { this.auteur = auteur; }
    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }
    public String getEditeur() { return editeur; }
    public void setEditeur(String editeur) { this.editeur = editeur; }
    public Domaine getDomaine() { return domaine; }
    public void setDomaine(Domaine domaine) { this.domaine = domaine; }
    public Integer getAnneePublication() { return anneePublication; }
    public void setAnneePublication(Integer anneePublication) { this.anneePublication = anneePublication; }
    public String getLocalisation() { return localisation; }
    public void setLocalisation(String localisation) { this.localisation = localisation; }
    public Integer getNbreExemplaires() { return nbreExemplaires; }
    public void setNbreExemplaires(Integer nbreExemplaires) { this.nbreExemplaires = nbreExemplaires; }
    public LocalDate getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }
}
