package com.bioelbaraka.service;

import com.bioelbaraka.dao.PanierDAO;
import com.bioelbaraka.dao.ProduitDAO;
import com.bioelbaraka.model.Panier;
import com.bioelbaraka.model.PanierItem;
import com.bioelbaraka.model.Produit;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class PanierService {
    @Autowired
    private PanierDAO panierDAO;
    @Autowired
    private ProduitDAO produitDAO;

    public Panier getPanierByUtilisateurId(Long utilisateurId) {
        return panierDAO.findByUtilisateurId(utilisateurId).orElse(null);
    }

    public void ajouterProduit(Long utilisateurId, Long produitId, int quantite) {
        Panier panier = panierDAO.findByUtilisateurId(utilisateurId).orElse(null);
        Produit produit = produitDAO.findById(produitId).orElse(null);
        if (panier != null && produit != null) {
            // Cherche si le produit est déjà dans le panier
            PanierItem item = panier.getItems().stream()
                .filter(i -> i.getProduit().getId().equals(produitId))
                .findFirst().orElse(null);
            if (item != null) {
                item.setQuantite(item.getQuantite() + quantite);
            } else {
                item = new PanierItem();
                item.setPanier(panier);
                item.setProduit(produit);
                item.setQuantite(quantite);
                panier.getItems().add(item);
            }
            panierDAO.save(panier);
        }
    }

    public void modifierQuantite(Long utilisateurId, Long produitId, int quantite) {
        Panier panier = panierDAO.findByUtilisateurId(utilisateurId).orElse(null);
        if (panier != null) {
            PanierItem item = panier.getItems().stream()
                .filter(i -> i.getProduit().getId().equals(produitId))
                .findFirst().orElse(null);
            if (item != null) {
                item.setQuantite(quantite);
                panierDAO.save(panier);
            }
        }
    }

    public void supprimerProduit(Long utilisateurId, Long produitId) {
        Panier panier = panierDAO.findByUtilisateurId(utilisateurId).orElse(null);
        if (panier != null) {
            panier.getItems().removeIf(i -> i.getProduit().getId().equals(produitId));
            panierDAO.save(panier);
        }
    }

    public List<PanierItem> getItems(Long utilisateurId) {
        Panier panier = panierDAO.findByUtilisateurId(utilisateurId).orElse(null);
        return panier != null ? panier.getItems() : null;
    }
} 