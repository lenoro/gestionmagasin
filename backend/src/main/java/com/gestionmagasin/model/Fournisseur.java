package com.gestionmagasin.model;

import jakarta.persistence.*;

@Entity
@Table(name = "stock_fournisseurs")
public class Fournisseur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 20)
    private String code;

    @Column(nullable = false)
    private String raisonSociale;

    @Column
    private String adresse;

    @Column
    private String ville;

    @Column
    private String telephone;

    @Column
    private String email;

    @Column
    private String nif;

    @Column
    private String rc;

    @Column
    private String contactNom;

    @Column
    private Integer delaiPaiementJours;

    @Column
    private Boolean actif = true;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getRaisonSociale() { return raisonSociale; }
    public void setRaisonSociale(String raisonSociale) { this.raisonSociale = raisonSociale; }
    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }
    public String getVille() { return ville; }
    public void setVille(String ville) { this.ville = ville; }
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getNif() { return nif; }
    public void setNif(String nif) { this.nif = nif; }
    public String getRc() { return rc; }
    public void setRc(String rc) { this.rc = rc; }
    public String getContactNom() { return contactNom; }
    public void setContactNom(String contactNom) { this.contactNom = contactNom; }
    public Integer getDelaiPaiementJours() { return delaiPaiementJours; }
    public void setDelaiPaiementJours(Integer delaiPaiementJours) { this.delaiPaiementJours = delaiPaiementJours; }
    public Boolean getActif() { return actif; }
    public void setActif(Boolean actif) { this.actif = actif; }
}
