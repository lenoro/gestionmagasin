package com.gestionmagasin.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "traces")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Utilisateur connecté au moment de l'action */
    private String utilisateur;

    /** Date et heure précises de l'action */
    @Column(nullable = false)
    private LocalDateTime horodatage;

    /** Entité concernée : ARTICLE, CLIENT, VENDEUR, FACTURE, AUTH */
    private String entite;

    /** Code article, N° facture, code client… */
    private String refProduit;

    /** AJOUT, MODIFICATION, SUPPRESSION, CONNEXION, ECHEC_CONNEXION */
    private String typeAction;

    /** Valeur avant modification (JSON ou texte lisible) */
    @Column(columnDefinition = "TEXT")
    private String ancienneValeur;

    /** Valeur après modification */
    @Column(columnDefinition = "TEXT")
    private String nouvelleValeur;

    /** Motif ou commentaire libre */
    private String commentaire;

    /** Adresse IP du client (pour les connexions) */
    private String adresseIp;
}
