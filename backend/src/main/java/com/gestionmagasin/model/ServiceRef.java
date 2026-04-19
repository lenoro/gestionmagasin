package com.gestionmagasin.model;

import jakarta.persistence.*;

@Entity
@Table(name = "services_ref")
public class ServiceRef {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "libelle", nullable = false, unique = true)
    private String libelle;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }
}
