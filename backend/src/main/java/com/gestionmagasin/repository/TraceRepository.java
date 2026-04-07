package com.gestionmagasin.repository;

import com.gestionmagasin.model.Trace;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TraceRepository extends JpaRepository<Trace, Long> {

    List<Trace> findAllByOrderByHorodatageDesc();

    List<Trace> findByEntiteOrderByHorodatageDesc(String entite);

    List<Trace> findByUtilisateurOrderByHorodatageDesc(String utilisateur);

    List<Trace> findByTypeActionOrderByHorodatageDesc(String typeAction);
}
