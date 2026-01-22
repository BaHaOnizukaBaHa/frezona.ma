package com.bioelbaraka.rest;

import com.bioelbaraka.model.Produit;
import com.bioelbaraka.service.ProduitService;
import com.bioelbaraka.security.RolesAllowed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produits")
public class ProduitResource {

    @Autowired
    private ProduitService produitService;

    @GetMapping
    public List<Produit> getAllProduits() {
        return produitService.getAllProduits();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produit> getProduitById(@PathVariable Long id) {
        Produit produit = produitService.getProduit(id);
        if (produit != null) {
            return ResponseEntity.ok(produit);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @RolesAllowed({"ADMIN"})
    public ResponseEntity<Produit> ajouterProduit(@RequestBody Produit produit) {
        try {
        produitService.ajouterProduit(produit);
            return ResponseEntity.status(HttpStatus.CREATED).body(produit);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    @RolesAllowed({"ADMIN"})
    public ResponseEntity<Produit> modifierProduit(@PathVariable Long id, @RequestBody Produit produit) {
        try {
           produit.setId(id);
            produitService.modifierProduit(produit);
            return ResponseEntity.ok(produit);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    @RolesAllowed({"ADMIN"})
    public ResponseEntity<Void> supprimerProduit(@PathVariable Long id) {
        try {
            produitService.supprimerProduit(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Endpoint pour initialiser des données de test
    @PostMapping("/init-test-data")
    @RolesAllowed({"ADMIN"})
    public ResponseEntity<String> initTestData() {
        try {
            // Créer des produits de test pour Frezona.ma - Seulement les 2 paniers spécifiés
            Produit[] testProducts = {
                // PRODUITS VEDETTES - Seulement les 2 paniers demandés
                new Produit("Panier Essentiel", "Pomme de terre 3kg, Onion 3kg, Tomate 2kg + Emballage", 74.00, 20, "/panier_royal1.jpg", "Frais"),
                new Produit("Panier Royal", "Légumes: Pomme de terre 3kg, Onion 3kg, Tomate 2kg, Poivron 1kg, Aubergine 1kg, Courgette 1kg, Citron 1kg + Produits laitiers: Beurre fermier 1kg, Lait fermenté 1L, Huile d'olive 1L, Œufs 5 unités", 359.00, 10, "/panier_royal2.jpg", "BIO")
            };

            for (Produit produit : testProducts) {
                produitService.ajouterProduit(produit);
            }

            return ResponseEntity.ok("Produits de test ajoutés avec succès (" + testProducts.length + " produits)");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de l'ajout des produits de test: " + e.getMessage());
        }
    }

    // Endpoint pour corriger les produits avec les bonnes informations
    @PostMapping("/fix-products")
    @RolesAllowed({"ADMIN"})
    public ResponseEntity<String> fixProducts() {
        try {
            // Supprimer les anciens produits incorrects (garder seulement les paniers)
            List<Produit> allProducts = produitService.getAllProduits();
            for (Produit produit : allProducts) {
                if (!produit.getNom().equals("Panier Essentiel") && !produit.getNom().equals("Panier Royal")) {
                    produitService.supprimerProduit(produit.getId());
                }
            }

            // Créer les produits corrects avec les bonnes informations
            Produit[] correctProducts = {
                new Produit("Huile d'olive 1L", "Huile d'olive extra vierge de qualité supérieure", 120.00, 50, "/zit2.jpg", "BIO"),
                new Produit("Œuf", "Œuf frais de poules élevées en plein air", 2.00, 100, "/oeuf.jpg", "Frais"),
                new Produit("Beurre fermier BIO 1kg", "Beurre fermier biologique artisanal", 100.00, 30, "/beurre_fermier.jpg", "BIO"),
                new Produit("Lait fermenté 1L", "Lait fermenté naturel sans conservateurs", 7.00, 40, "/lait_fermente.jpg", "BIO")
            };

            for (Produit produit : correctProducts) {
                produitService.ajouterProduit(produit);
            }

            return ResponseEntity.ok("Produits corrigés avec succès (" + correctProducts.length + " produits)");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de la correction des produits: " + e.getMessage());
        }
    }

    // Endpoint pour forcer la réinitialisation des données
    @PostMapping("/reset-test-data")
    @RolesAllowed({"ADMIN"})
    public ResponseEntity<String> resetTestData() {
        try {
            // Supprimer tous les produits existants
            List<Produit> existingProducts = produitService.getAllProduits();
            for (Produit produit : existingProducts) {
                produitService.supprimerProduit(produit.getId());
            }

            // Créer des produits de test pour Frezona.ma - Seulement les 2 paniers spécifiés
            Produit[] testProducts = {
                // PRODUITS VEDETTES - Seulement les 2 paniers demandés
                new Produit("Panier Essentiel", "Pomme de terre 3kg, Onion 3kg, Tomate 2kg + Emballage", 74.00, 20, "/panier_royal1.jpg", "Frais"),
                new Produit("Panier Royal", "Légumes: Pomme de terre 3kg, Onion 3kg, Tomate 2kg, Poivron 1kg, Aubergine 1kg, Courgette 1kg, Citron 1kg + Produits laitiers: Beurre fermier 1kg, Lait fermenté 1L, Huile d'olive 1L, Œufs 5 unités", 359.00, 10, "/panier_royal2.jpg", "BIO")
            };

            for (Produit produit : testProducts) {
                produitService.ajouterProduit(produit);
            }

            return ResponseEntity.ok("Produits réinitialisés avec succès (" + testProducts.length + " produits)");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de la réinitialisation des produits: " + e.getMessage());
        }
    }
} 