package com.gestionmagasin.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "mouvements_inventaire")
public class MouvementInventaire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "bien_id", nullable = false)
    private BienInventaire bien;

    @Column(name = "type_mouvement", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private TypeMouvement typeMouvement;

    @Column(name = "date_operation", nullable = false)
    private LocalDate dateOperation;

    @Column(name = "affectation_source")
    private String affectationSource;

    @Column(name = "affectation_destination")
    private String affectationDestination;

    @Column(name = "motif", nullable = false, columnDefinition = "TEXT")
    private String motif;

    @Column(name = "visa")
    private String visa;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public BienInventaire getBien() { return bien; }
    public void setBien(BienInventaire bien) { this.bien = bien; }
    public TypeMouvement getTypeMouvement() { return typeMouvement; }
    public void setTypeMouvement(TypeMouvement typeMouvement) { this.typeMouvement = typeMouvement; }
    public LocalDate getDateOperation() { return dateOperation; }
    public void setDateOperation(LocalDate dateOperation) { this.dateOperation = dateOperation; }
    public String getAffectationSource() { return affectationSource; }
    public void setAffectationSource(String affectationSource) { this.affectationSource = affectationSource; }
    public String getAffectationDestination() { return affectationDestination; }
    public void setAffectationDestination(String affectationDestination) { this.affectationDestination = affectationDestination; }
    public String getMotif() { return motif; }
    public void setMotif(String motif) { this.motif = motif; }
    public String getVisa() { return visa; }
    public void setVisa(String visa) { this.visa = visa; }
}
