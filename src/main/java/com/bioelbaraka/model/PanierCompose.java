package com.bioelbaraka.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "paniers_composes")
public class PanierCompose implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String description;
    private double prix;
    private String imageUrl;
    private boolean actif = true;

    @ElementCollection
    @CollectionTable(name = "panier_compose_produits", joinColumns = @JoinColumn(name = "panier_id"))
    private List<PanierProduitItem> produits = new ArrayList<>();

    // Constructeurs
    public PanierCompose() {}

    public PanierCompose(String nom, String description, double prix, String imageUrl) {
        this.nom = nom;
        this.description = description;
        this.prix = prix;
        this.imageUrl = imageUrl;
    }

    // Getters et setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getPrix() { return prix; }
    public void setPrix(double prix) { this.prix = prix; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public boolean isActif() { return actif; }
    public void setActif(boolean actif) { this.actif = actif; }

    public List<PanierProduitItem> getProduits() { return produits; }
    public void setProduits(List<PanierProduitItem> produits) { this.produits = produits; }
}

