package com.gestionmagasin.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "stock_carburant")
public class StockCarburant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "type_carburant", nullable = false, unique = true, length = 10)
    @Enumerated(EnumType.STRING)
    private TypeCarburant typeCarburant;

    @Column(name = "quantite_litres", nullable = false, precision = 12, scale = 3)
    private BigDecimal quantiteLitres = BigDecimal.ZERO;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public TypeCarburant getTypeCarburant() { return typeCarburant; }
    public void setTypeCarburant(TypeCarburant typeCarburant) { this.typeCarburant = typeCarburant; }
    public BigDecimal getQuantiteLitres() { return quantiteLitres; }
    public void setQuantiteLitres(BigDecimal quantiteLitres) { this.quantiteLitres = quantiteLitres; }
}
