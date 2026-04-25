package com.gestionmagasin.dto;

public class LigneConsommationDto {
    private String articleCode;
    private String articleName;
    private String numNomenclature;
    private String unitesMesure;
    private int qteTotal;
    private String services;
    private String consommateurs;

    public LigneConsommationDto(String articleCode, String articleName,
            String numNomenclature, String unitesMesure,
            int qteTotal, String services, String consommateurs) {
        this.articleCode = articleCode;
        this.articleName = articleName;
        this.numNomenclature = numNomenclature;
        this.unitesMesure = unitesMesure;
        this.qteTotal = qteTotal;
        this.services = services;
        this.consommateurs = consommateurs;
    }

    public String getArticleCode() { return articleCode; }
    public String getArticleName() { return articleName; }
    public String getNumNomenclature() { return numNomenclature; }
    public String getUnitesMesure() { return unitesMesure; }
    public int getQteTotal() { return qteTotal; }
    public String getServices() { return services; }
    public String getConsommateurs() { return consommateurs; }
}
