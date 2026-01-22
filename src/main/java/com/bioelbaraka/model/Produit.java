package com.bioelbaraka.model;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "produits")
public class Produit implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String description;
    private double prix;
    private int stock;
    private String imageUrl;
    private String categorie;
    private String unite; // kg, L, unité, pièce, etc.

    // Constructeurs
    public Produit() {}

    public Produit(String nom, String description, double prix, int stock, String imageUrl, String categorie) {
        this.nom = nom;
        this.description = description;
        this.prix = prix;
        this.stock = stock;
        this.imageUrl = imageUrl;
        this.categorie = categorie;
        this.unite = "unité"; // Default value
    }

    public Produit(String nom, String description, double prix, int stock, String imageUrl, String categorie, String unite) {
        this.nom = nom;
        this.description = description;
        this.prix = prix;
        this.stock = stock;
        this.imageUrl = imageUrl;
        this.categorie = categorie;
        this.unite = unite;
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
    
    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public String getCategorie() { return categorie; }
    public void setCategorie(String categorie) { this.categorie = categorie; }
    
    public String getUnite() { return unite; }
    public void setUnite(String unite) { this.unite = unite; }
}
