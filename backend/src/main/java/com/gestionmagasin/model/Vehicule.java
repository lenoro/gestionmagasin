package com.gestionmagasin.model;

import jakarta.persistence.*;

@Entity
@Table(name = "vehicules")
public class Vehicule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "immatriculation", nullable = false, unique = true, length = 20)
    private String immatriculation;

    @Column(name = "marque", nullable = false)
    private String marque;

    @Column(name = "modele")
    private String modele;

    @Column(name = "type_carburant", nullable = false, length = 10)
    @Enumerated(EnumType.STRING)
    private TypeCarburant typeCarburant;

    @Column(name = "chauffeur_habituel")
    private String chauffeurHabituel;

    @Column(name = "observations", columnDefinition = "TEXT")
    private String observations;

    @Column(name = "statut", nullable = false, length = 10)
    @Enumerated(EnumType.STRING)
    private StatutVehicule statut = StatutVehicule.ACTIF;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getImmatriculation() { return immatriculation; }
    public void setImmatriculation(String immatriculation) { this.immatriculation = immatriculation; }
    public String getMarque() { return marque; }
    public void setMarque(String marque) { this.marque = marque; }
    public String getModele() { return modele; }
    public void setModele(String modele) { this.modele = modele; }
    public TypeCarburant getTypeCarburant() { return typeCarburant; }
    public void setTypeCarburant(TypeCarburant typeCarburant) { this.typeCarburant = typeCarburant; }
    public String getChauffeurHabituel() { return chauffeurHabituel; }
    public void setChauffeurHabituel(String chauffeurHabituel) { this.chauffeurHabituel = chauffeurHabituel; }
    public String getObservations() { return observations; }
    public void setObservations(String observations) { this.observations = observations; }
    public StatutVehicule getStatut() { return statut; }
    public void setStatut(StatutVehicule statut) { this.statut = statut; }
}
