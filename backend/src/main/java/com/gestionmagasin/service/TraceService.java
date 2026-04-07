package com.gestionmagasin.service;

import com.gestionmagasin.model.Trace;
import com.gestionmagasin.repository.TraceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TraceService {

    private final TraceRepository traceRepo;

    /**
     * Enregistre une action sur une entité métier.
     */
    public void log(String entite, String typeAction, String ref,
                    String ancienneValeur, String nouvelleValeur, String commentaire) {
        Trace trace = Trace.builder()
                .utilisateur(getUtilisateur())
                .horodatage(LocalDateTime.now())
                .entite(entite)
                .typeAction(typeAction)
                .refProduit(ref)
                .ancienneValeur(ancienneValeur)
                .nouvelleValeur(nouvelleValeur)
                .commentaire(commentaire)
                .build();
        traceRepo.save(trace);
    }

    /**
     * Enregistre une tentative de connexion (succès ou échec).
     */
    public void logConnexion(String utilisateur, boolean succes, String adresseIp) {
        Trace trace = Trace.builder()
                .utilisateur(utilisateur)
                .horodatage(LocalDateTime.now())
                .entite("AUTH")
                .typeAction(succes ? "CONNEXION" : "ECHEC_CONNEXION")
                .commentaire(succes ? "Connexion réussie" : "Tentative de connexion échouée")
                .adresseIp(adresseIp)
                .build();
        traceRepo.save(trace);
    }

    /** Récupère l'utilisateur connecté depuis le contexte Spring Security. */
    private String getUtilisateur() {
        try {
            String name = SecurityContextHolder.getContext().getAuthentication().getName();
            return (name != null && !name.equals("anonymousUser")) ? name : "système";
        } catch (Exception e) {
            return "système";
        }
    }

    public List<Trace> getAll() {
        return traceRepo.findAllByOrderByHorodatageDesc();
    }

    public List<Trace> getByEntite(String entite) {
        return traceRepo.findByEntiteOrderByHorodatageDesc(entite);
    }

    public List<Trace> getByUtilisateur(String utilisateur) {
        return traceRepo.findByUtilisateurOrderByHorodatageDesc(utilisateur);
    }

    public List<Trace> getByAction(String typeAction) {
        return traceRepo.findByTypeActionOrderByHorodatageDesc(typeAction);
    }
}
