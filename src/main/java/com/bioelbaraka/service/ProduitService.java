package com.bioelbaraka.service;

import com.bioelbaraka.dao.ProduitDAO;
import com.bioelbaraka.model.Produit;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class ProduitService {
    @Autowired
    private ProduitDAO produitDAO;

    public void ajouterProduit(Produit produit) {
        produitDAO.save(produit);
    }

    public Produit getProduit(Long id) {
        return produitDAO.findById(id).orElse(null);
    }

    public List<Produit> getAllProduits() {
        return produitDAO.findAll();
    }

    public void modifierProduit(Produit produit) {
        produitDAO.save(produit);
    }

    public void supprimerProduit(Long id) {
        produitDAO.deleteById(id);
    }

    public List<Produit> rechercherProduits(String nom, String categorie, Double prixMin, Double prixMax) {
        List<Produit> produits = produitDAO.findAll();
        return produits.stream()
            .filter(p -> (nom == null || p.getNom().toLowerCase().contains(nom.toLowerCase())))
            .filter(p -> (categorie == null || (p.getCategorie() != null && p.getCategorie().toLowerCase().contains(categorie.toLowerCase()))))
            .filter(p -> (prixMin == null || p.getPrix() >= prixMin))
            .filter(p -> (prixMax == null || p.getPrix() <= prixMax))
            .toList();
    }

    // Pour la recherche avancée, il faudra ajouter une méthode personnalisée dans ProduitDAO si besoin
} 