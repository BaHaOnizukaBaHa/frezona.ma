package com.bioelbaraka.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class PanierProduitItem {
    private Long produitId;
    private String nomProduit;
    private String quantiteDescription; // ex: "500g", "1L", "2 pièces"

    public PanierProduitItem() {}

    public PanierProduitItem(Long produitId, String nomProduit, String quantiteDescription) {
        this.produitId = produitId;
        this.nomProduit = nomProduit;
        this.quantiteDescription = quantiteDescription;
    }

    // Getters et setters
    public Long getProduitId() { return produitId; }
    public void setProduitId(Long produitId) { this.produitId = produitId; }

    public String getNomProduit() { return nomProduit; }
    public void setNomProduit(String nomProduit) { this.nomProduit = nomProduit; }

    public String getQuantiteDescription() { return quantiteDescription; }
    public void setQuantiteDescription(String quantiteDescription) { this.quantiteDescription = quantiteDescription; }
}

