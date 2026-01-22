package com.bioelbaraka.dto;

import java.util.List;

public class CommandeDTO {
    private String email;
    private String prenom;
    private String nom;
    private String telephone;
    private String adresse;
    private String ville;
    private String notes;
    private double total;
    private double fraisLivraison;
    private List<CommandeItemDTO> items;

    // Getters et setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    
    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }
    
    public String getVille() { return ville; }
    public void setVille(String ville) { this.ville = ville; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }
    
    public double getFraisLivraison() { return fraisLivraison; }
    public void setFraisLivraison(double fraisLivraison) { this.fraisLivraison = fraisLivraison; }
    
    public List<CommandeItemDTO> getItems() { return items; }
    public void setItems(List<CommandeItemDTO> items) { this.items = items; }

    // Classe interne pour les items
    public static class CommandeItemDTO {
        private Long id;
        private String nom;
        private double prix;
        private int quantite;
        private String imageUrl;

        // Getters et setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        
        public String getNom() { return nom; }
        public void setNom(String nom) { this.nom = nom; }
        
        public double getPrix() { return prix; }
        public void setPrix(double prix) { this.prix = prix; }
        
        public int getQuantite() { return quantite; }
        public void setQuantite(int quantite) { this.quantite = quantite; }
        
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    }
}

