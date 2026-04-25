package com.gestionmagasin.dto;

public class ArticleBesoinDto {
    private String articleCode;
    private String articleName;
    private String numNomenclature;
    private String unitesMesure;
    private double stockActuel;
    private double stockMinimum;
    private double qteACommander;

    public ArticleBesoinDto(String articleCode, String articleName,
            String numNomenclature, String unitesMesure,
            double stockActuel, double stockMinimum) {
        this.articleCode = articleCode;
        this.articleName = articleName;
        this.numNomenclature = numNomenclature;
        this.unitesMesure = unitesMesure;
        this.stockActuel = stockActuel;
        this.stockMinimum = stockMinimum;
        this.qteACommander = Math.max(0, stockMinimum - stockActuel);
    }

    public String getArticleCode() { return articleCode; }
    public String getArticleName() { return articleName; }
    public String getNumNomenclature() { return numNomenclature; }
    public String getUnitesMesure() { return unitesMesure; }
    public double getStockActuel() { return stockActuel; }
    public double getStockMinimum() { return stockMinimum; }
    public double getQteACommander() { return qteACommander; }
}
