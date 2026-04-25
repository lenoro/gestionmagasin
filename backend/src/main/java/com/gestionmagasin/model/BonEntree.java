package com.gestionmagasin.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bons_entree_inventaire")
public class BonEntree {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_bon", nullable = false, unique = true, length = 20)
    private String numeroBon;

    @Column(name = "type_bon", nullable = false, length = 30)
    @Enumerated(EnumType.STRING)
    private TypeBonEntree typeBon;

    @Column(name = "date_bon", nullable = false)
    private LocalDate dateBon;

    @ManyToOne
    @JoinColumn(name = "fournisseur_id")
    private Fournisseur fournisseur;

    @Column(name = "num_bon_livraison", length = 30)
    private String numBonLivraison;

    @Column(name = "num_bon_commande", length = 30)
    private String numBonCommande;

    @ManyToOne
    @JoinColumn(name = "service_source_id")
    private Affectation serviceSource;

    @Column(name = "statut", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private StatutBonEntree statut = StatutBonEntree.BROUILLON;

    @Column(name = "visa")
    private String visa;

    @Column(name = "observations", columnDefinition = "TEXT")
    private String observations;

    @Column(name = "created_at")
    private LocalDate createdAt;

    @OneToMany(mappedBy = "bon", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LigneBonEntree> lignes = new ArrayList<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNumeroBon() { return numeroBon; }
    public void setNumeroBon(String numeroBon) { this.numeroBon = numeroBon; }
    public TypeBonEntree getTypeBon() { return typeBon; }
    public void setTypeBon(TypeBonEntree typeBon) { this.typeBon = typeBon; }
    public LocalDate getDateBon() { return dateBon; }
    public void setDateBon(LocalDate dateBon) { this.dateBon = dateBon; }
    public Fournisseur getFournisseur() { return fournisseur; }
    public void setFournisseur(Fournisseur fournisseur) { this.fournisseur = fournisseur; }
    public String getNumBonLivraison() { return numBonLivraison; }
    public void setNumBonLivraison(String numBonLivraison) { this.numBonLivraison = numBonLivraison; }
    public String getNumBonCommande() { return numBonCommande; }
    public void setNumBonCommande(String numBonCommande) { this.numBonCommande = numBonCommande; }
    public Affectation getServiceSource() { return serviceSource; }
    public void setServiceSource(Affectation serviceSource) { this.serviceSource = serviceSource; }
    public StatutBonEntree getStatut() { return statut; }
    public void setStatut(StatutBonEntree statut) { this.statut = statut; }
    public String getVisa() { return visa; }
    public void setVisa(String visa) { this.visa = visa; }
    public String getObservations() { return observations; }
    public void setObservations(String observations) { this.observations = observations; }
    public LocalDate getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }
    public List<LigneBonEntree> getLignes() { return lignes; }
    public void setLignes(List<LigneBonEntree> lignes) { this.lignes = lignes; }
}
