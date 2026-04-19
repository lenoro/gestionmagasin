package com.gestionmagasin.model;

import jakarta.persistence.*;

@Entity
@Table(name = "employes")
public class Employe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "matricule", unique = true)
    private String matricule;

    @Column(name = "nom", nullable = false)
    private String nom;

    @Column(name = "prenom")
    private String prenom;

    @Column(name = "grade")
    private String grade;

    @Column(name = "fonction")
    private String fonction;

    @Column(name = "service")
    private String service;

    @Column(name = "telephone")
    private String telephone;

    @Column(name = "email")
    private String email;

    @Column(name = "actif")
    private Boolean actif = true;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getMatricule() { return matricule; }
    public void setMatricule(String matricule) { this.matricule = matricule; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
    public String getFonction() { return fonction; }
    public void setFonction(String fonction) { this.fonction = fonction; }
    public String getService() { return service; }
    public void setService(String service) { this.service = service; }
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Boolean getActif() { return actif; }
    public void setActif(Boolean actif) { this.actif = actif; }
}
