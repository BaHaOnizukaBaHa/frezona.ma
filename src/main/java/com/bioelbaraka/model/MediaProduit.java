package com.bioelbaraka.model;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "media_produits")
public class MediaProduit implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String url;
    private String type; // image ou video

    @ManyToOne
    @JoinColumn(name = "produit_id")
    private Produit produit;

    // Getters et setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Produit getProduit() { return produit; }
    public void setProduit(Produit produit) { this.produit = produit; }
} 