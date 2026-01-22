package com.bioelbaraka.rest;

import com.bioelbaraka.dao.PanierComposeDAO;
import com.bioelbaraka.model.PanierCompose;
import com.bioelbaraka.model.PanierProduitItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/paniers-composes")
public class PanierComposeResource {

    @Autowired
    private PanierComposeDAO panierComposeDAO;

    // Récupérer tous les paniers
    @GetMapping
    public List<PanierCompose> getAllPaniers() {
        return panierComposeDAO.findAll();
    }

    // Récupérer les paniers actifs (pour les clients)
    @GetMapping("/actifs")
    public List<PanierCompose> getPaniersActifs() {
        return panierComposeDAO.findByActifTrue();
    }

    // Récupérer un panier par ID
    @GetMapping("/{id}")
    public ResponseEntity<PanierCompose> getPanierById(@PathVariable Long id) {
        return panierComposeDAO.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Créer un nouveau panier
    @PostMapping
    public ResponseEntity<?> createPanier(@RequestBody Map<String, Object> panierData) {
        try {
            PanierCompose panier = new PanierCompose();
            panier.setNom((String) panierData.get("nom"));
            panier.setDescription((String) panierData.get("description"));
            panier.setPrix(Double.parseDouble(panierData.get("prix").toString()));
            panier.setImageUrl((String) panierData.get("imageUrl"));
            panier.setActif(panierData.get("actif") != null ? (Boolean) panierData.get("actif") : true);

            // Ajouter les produits
            if (panierData.get("produits") != null) {
                List<Map<String, Object>> produitsData = (List<Map<String, Object>>) panierData.get("produits");
                List<PanierProduitItem> produits = new ArrayList<>();
                
                for (Map<String, Object> produitData : produitsData) {
                    PanierProduitItem item = new PanierProduitItem();
                    if (produitData.get("produitId") != null) {
                        item.setProduitId(Long.parseLong(produitData.get("produitId").toString()));
                    }
                    item.setNomProduit((String) produitData.get("nomProduit"));
                    item.setQuantiteDescription((String) produitData.get("quantiteDescription"));
                    produits.add(item);
                }
                panier.setProduits(produits);
            }

            PanierCompose savedPanier = panierComposeDAO.save(panier);
            return ResponseEntity.ok(savedPanier);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }

    // Mettre à jour un panier
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePanier(@PathVariable Long id, @RequestBody Map<String, Object> panierData) {
        return panierComposeDAO.findById(id)
                .map(panier -> {
                    if (panierData.get("nom") != null) {
                        panier.setNom((String) panierData.get("nom"));
                    }
                    if (panierData.get("description") != null) {
                        panier.setDescription((String) panierData.get("description"));
                    }
                    if (panierData.get("prix") != null) {
                        panier.setPrix(Double.parseDouble(panierData.get("prix").toString()));
                    }
                    if (panierData.get("imageUrl") != null) {
                        panier.setImageUrl((String) panierData.get("imageUrl"));
                    }
                    if (panierData.get("actif") != null) {
                        panier.setActif((Boolean) panierData.get("actif"));
                    }

                    // Mettre à jour les produits
                    if (panierData.get("produits") != null) {
                        List<Map<String, Object>> produitsData = (List<Map<String, Object>>) panierData.get("produits");
                        List<PanierProduitItem> produits = new ArrayList<>();
                        
                        for (Map<String, Object> produitData : produitsData) {
                            PanierProduitItem item = new PanierProduitItem();
                            if (produitData.get("produitId") != null) {
                                item.setProduitId(Long.parseLong(produitData.get("produitId").toString()));
                            }
                            item.setNomProduit((String) produitData.get("nomProduit"));
                            item.setQuantiteDescription((String) produitData.get("quantiteDescription"));
                            produits.add(item);
                        }
                        panier.setProduits(produits);
                    }

                    return ResponseEntity.ok(panierComposeDAO.save(panier));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Supprimer un panier
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePanier(@PathVariable Long id) {
        return panierComposeDAO.findById(id)
                .map(panier -> {
                    panierComposeDAO.delete(panier);
                    return ResponseEntity.ok().body("Panier supprimé avec succès");
                })
                .orElse(ResponseEntity.notFound().build());
    }
}

