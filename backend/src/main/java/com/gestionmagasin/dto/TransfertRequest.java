package com.gestionmagasin.dto;

public class TransfertRequest {
    private Long affectationId;
    private String affectationLibre;
    private String motif;
    private String visa;

    public Long getAffectationId() { return affectationId; }
    public void setAffectationId(Long affectationId) { this.affectationId = affectationId; }
    public String getAffectationLibre() { return affectationLibre; }
    public void setAffectationLibre(String affectationLibre) { this.affectationLibre = affectationLibre; }
    public String getMotif() { return motif; }
    public void setMotif(String motif) { this.motif = motif; }
    public String getVisa() { return visa; }
    public void setVisa(String visa) { this.visa = visa; }
}
