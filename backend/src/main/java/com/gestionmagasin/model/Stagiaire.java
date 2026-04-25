package com.gestionmagasin.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "stagiaires")
public class Stagiaire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "num_inscription", unique = true, nullable = false)
    private String numInscription;

    @Column(name = "nom_prenom", nullable = false)
    private String nomPrenom;

    @Column(name = "groupe_section")
    private String groupeSection;

    @Column(name = "date_debut_formation")
    private LocalDate dateDebutFormation;

    @Column(name = "date_fin_formation")
    private LocalDate dateFinFormation;

    @Column(name = "kit_remis")
    private Boolean kitRemis = false;

    @Column(name = "date_remise_trousseau")
    private LocalDate dateRemiseTrousseau;

    @Column(name = "caution_versee")
    private Boolean cautionVersee = false;

    @Column(name = "etat_retour", length = 20)
    private String etatRetour;

    @Column(name = "observations", columnDefinition = "TEXT")
    private String observations;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNumInscription() { return numInscription; }
    public void setNumInscription(String numInscription) { this.numInscription = numInscription; }
    public String getNomPrenom() { return nomPrenom; }
    public void setNomPrenom(String nomPrenom) { this.nomPrenom = nomPrenom; }
    public String getGroupeSection() { return groupeSection; }
    public void setGroupeSection(String groupeSection) { this.groupeSection = groupeSection; }
    public LocalDate getDateDebutFormation() { return dateDebutFormation; }
    public void setDateDebutFormation(LocalDate dateDebutFormation) { this.dateDebutFormation = dateDebutFormation; }
    public LocalDate getDateFinFormation() { return dateFinFormation; }
    public void setDateFinFormation(LocalDate dateFinFormation) { this.dateFinFormation = dateFinFormation; }
    public Boolean getKitRemis() { return kitRemis; }
    public void setKitRemis(Boolean kitRemis) { this.kitRemis = kitRemis; }
    public LocalDate getDateRemiseTrousseau() { return dateRemiseTrousseau; }
    public void setDateRemiseTrousseau(LocalDate dateRemiseTrousseau) { this.dateRemiseTrousseau = dateRemiseTrousseau; }
    public Boolean getCautionVersee() { return cautionVersee; }
    public void setCautionVersee(Boolean cautionVersee) { this.cautionVersee = cautionVersee; }
    public String getEtatRetour() { return etatRetour; }
    public void setEtatRetour(String etatRetour) { this.etatRetour = etatRetour; }
    public String getObservations() { return observations; }
    public void setObservations(String observations) { this.observations = observations; }
}
