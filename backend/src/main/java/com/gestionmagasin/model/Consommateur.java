package com.gestionmagasin.model;

import jakarta.persistence.*;

@Entity
@Table(name = "consommateurs")
public class Consommateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nom_prenom", nullable = false)
    private String nomPrenom;

    @Column(name = "service_atelier")
    private String serviceAtelier;

    @Column(name = "type_consommateur", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private TypeConsommateur typeConsommateur = TypeConsommateur.ENSEIGNANT;

    @Column(name = "telephone")
    private String telephone;

    @Column(name = "actif")
    private Boolean actif = true;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNomPrenom() { return nomPrenom; }
    public void setNomPrenom(String nomPrenom) { this.nomPrenom = nomPrenom; }
    public String getServiceAtelier() { return serviceAtelier; }
    public void setServiceAtelier(String serviceAtelier) { this.serviceAtelier = serviceAtelier; }
    public TypeConsommateur getTypeConsommateur() { return typeConsommateur; }
    public void setTypeConsommateur(TypeConsommateur typeConsommateur) { this.typeConsommateur = typeConsommateur; }
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    public Boolean getActif() { return actif; }
    public void setActif(Boolean actif) { this.actif = actif; }
}
