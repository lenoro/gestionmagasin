package com.gestionmagasin.model;

import jakarta.persistence.*;

@Entity
@Table(name = "etablissement")
public class Etablissement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "rep", length = 60)
    private String rep;

    @Column(name = "ministere", length = 70)
    private String ministere;

    @Column(name = "wilaya", length = 70)
    private String wilaya;

    @Column(name = "centre", length = 70)
    private String centre;

    @Column(name = "responsable", length = 70)
    private String responsable;

    // getters & setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getRep() { return rep; }
    public void setRep(String rep) { this.rep = rep; }
    public String getMinistere() { return ministere; }
    public void setMinistere(String ministere) { this.ministere = ministere; }
    public String getWilaya() { return wilaya; }
    public void setWilaya(String wilaya) { this.wilaya = wilaya; }
    public String getCentre() { return centre; }
    public void setCentre(String centre) { this.centre = centre; }
    public String getResponsable() { return responsable; }
    public void setResponsable(String responsable) { this.responsable = responsable; }
}
