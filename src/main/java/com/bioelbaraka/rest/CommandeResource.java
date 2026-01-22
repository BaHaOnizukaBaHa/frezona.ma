package com.bioelbaraka.rest;

import com.bioelbaraka.model.Commande;
import com.bioelbaraka.model.CommandeItem;
import com.bioelbaraka.model.Utilisateur;
import com.bioelbaraka.model.Produit;
import com.bioelbaraka.service.CommandeService;
import com.bioelbaraka.service.UtilisateurService;
import com.bioelbaraka.service.ProduitService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Date;

/**
 * Contrôleur REST pour la gestion des commandes
 * Endpoints: /api/commandes
 */
@RestController
@RequestMapping("/api/commandes")
public class CommandeResource {
    
    @Autowired
    private CommandeService commandeService;
    
    @Autowired
    private UtilisateurService utilisateurService;
    
    @Autowired
    private ProduitService produitService;

    /**
     * GET /api/commandes
     * Récupère toutes les commandes (Admin)
     */
    @GetMapping
    public ResponseEntity<List<Commande>> getAllCommandes() {
        try {
            List<Commande> commandes = commandeService.getAllCommandes();
            return ResponseEntity.ok(commandes);
        } catch (Exception e) {
            System.err.println("❌ Erreur récupération commandes: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/commandes/{id}
     * Récupère une commande par son ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Commande> getCommande(@PathVariable Long id) {
        try {
            Commande commande = commandeService.getCommande(id);
            if (commande == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(commande);
        } catch (Exception e) {
            System.err.println("❌ Erreur récupération commande #" + id + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/commandes/user/{email}
     * Récupère les commandes d'un utilisateur par son email
     */
    @GetMapping("/user/{email}")
    public ResponseEntity<?> getCommandesByUser(@PathVariable String email) {
        try {
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email requis"));
            }

            Utilisateur user = utilisateurService.getUtilisateurByEmail(email.toLowerCase());
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Utilisateur non trouvé"));
            }

            List<Commande> commandes = commandeService.getCommandesByUtilisateur(user);
            return ResponseEntity.ok(commandes);

        } catch (Exception e) {
            System.err.println("❌ Erreur récupération commandes utilisateur: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Erreur: " + e.getMessage()));
        }
    }

    /**
     * POST /api/commandes
     * Crée une nouvelle commande
     */
    @PostMapping
    public ResponseEntity<?> ajouterCommande(@RequestBody Map<String, Object> commandeData) {
        try {
            // Validation des champs obligatoires
            String email = (String) commandeData.get("email");
            String prenom = (String) commandeData.get("prenom");
            String nom = (String) commandeData.get("nom");
            String telephone = (String) commandeData.get("telephone");
            String adresse = (String) commandeData.get("adresse");
            String ville = (String) commandeData.get("ville");

            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "L'email est obligatoire"));
            }
            if (prenom == null || prenom.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Le prénom est obligatoire"));
            }
            if (nom == null || nom.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Le nom est obligatoire"));
            }
            if (telephone == null || telephone.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Le téléphone est obligatoire"));
            }
            if (adresse == null || adresse.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "L'adresse est obligatoire"));
            }

            // Créer la commande
            Commande commande = new Commande();
            commande.setDate(new Date());
            commande.setStatut("EN_ATTENTE");
            commande.setEmail(email.trim().toLowerCase());
            commande.setPrenom(prenom.trim());
            commande.setNom(nom.trim());
            commande.setTelephone(telephone.trim());
            commande.setAdresseLivraison(adresse.trim());
            commande.setVille(ville != null ? ville.trim() : "Rabat");

            // Total
            Object totalObj = commandeData.get("total");
            if (totalObj != null) {
                commande.setTotal(((Number) totalObj).doubleValue());
            }

            // Associer l'utilisateur si existant
            Utilisateur user = utilisateurService.getUtilisateurByEmail(email.toLowerCase());
            if (user != null) {
                commande.setUtilisateur(user);
            }

            // Ajouter les items de la commande et vérifier/réduire le stock
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> items = (List<Map<String, Object>>) commandeData.get("items");
            if (items != null && !items.isEmpty()) {
                // Première passe: vérifier la disponibilité du stock
                for (Map<String, Object> itemData : items) {
                    Object produitIdObj = itemData.get("produitId");
                    if (produitIdObj != null) {
                        Long produitId = ((Number) produitIdObj).longValue();
                        Produit produit = produitService.getProduit(produitId);
                        if (produit != null) {
                            int quantiteDemandee = 1;
                            if (itemData.get("quantite") != null) {
                                quantiteDemandee = ((Number) itemData.get("quantite")).intValue();
                            }
                            
                            // Vérifier si le stock est suffisant
                            if (produit.getStock() < quantiteDemandee) {
                                return ResponseEntity.badRequest()
                                    .body(Map.of(
                                        "success", false, 
                                        "message", "Stock insuffisant pour " + produit.getNom() + 
                                                   ". Disponible: " + produit.getStock() + 
                                                   ", Demandé: " + quantiteDemandee
                                    ));
                            }
                        }
                    }
                }
                
                // Deuxième passe: créer les items et réduire le stock
                for (Map<String, Object> itemData : items) {
                    CommandeItem item = new CommandeItem();
                    
                    // Récupérer les infos du produit
                    Object produitIdObj = itemData.get("produitId");
                    int quantite = 1;
                    if (itemData.get("quantite") != null) {
                        quantite = ((Number) itemData.get("quantite")).intValue();
                    }
                    
                    if (produitIdObj != null) {
                        Long produitId = ((Number) produitIdObj).longValue();
                        Produit produit = produitService.getProduit(produitId);
                        if (produit != null) {
                            item.setProduit(produit);
                            item.setNomProduit(produit.getNom());
                            item.setPrixUnitaire(produit.getPrix());
                            item.setImageUrl(produit.getImageUrl());
                            
                            // 🔻 RÉDUIRE LE STOCK
                            int nouveauStock = produit.getStock() - quantite;
                            produit.setStock(nouveauStock);
                            produitService.modifierProduit(produit);
                            System.out.println("📉 Stock " + produit.getNom() + ": " + 
                                             (nouveauStock + quantite) + " → " + nouveauStock);
                        }
                    }
                    
                    // Utiliser les valeurs fournies si disponibles
                    if (itemData.get("nomProduit") != null) {
                        item.setNomProduit((String) itemData.get("nomProduit"));
                    }
                    if (itemData.get("prixUnitaire") != null) {
                        item.setPrixUnitaire(((Number) itemData.get("prixUnitaire")).doubleValue());
                    }
                    if (itemData.get("imageUrl") != null) {
                        item.setImageUrl((String) itemData.get("imageUrl"));
                    }
                    item.setQuantite(quantite);
                    
                    commande.addItem(item);
                }
                System.out.println("📦 " + items.size() + " produits ajoutés à la commande (stock mis à jour)");
            }

            // Sauvegarder la commande
            commandeService.ajouterCommande(commande);
            System.out.println("✅ Nouvelle commande #" + commande.getId() + " créée pour " + email);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Commande créée avec succès");
            response.put("commandeId", commande.getId());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            System.err.println("❌ Erreur création commande: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("success", false, "message", "Erreur: " + e.getMessage()));
        }
    }

    /**
     * PUT /api/commandes/{id}
     * Modifie une commande existante
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> modifierCommande(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        try {
            Commande commande = commandeService.getCommande(id);
            if (commande == null) {
                return ResponseEntity.notFound().build();
            }

            // Mettre à jour les champs fournis
            if (updates.containsKey("statut")) {
                commande.setStatut((String) updates.get("statut"));
            }
            if (updates.containsKey("adresse")) {
                commande.setAdresseLivraison((String) updates.get("adresse"));
            }
            if (updates.containsKey("ville")) {
                commande.setVille((String) updates.get("ville"));
            }
            if (updates.containsKey("telephone")) {
                commande.setTelephone((String) updates.get("telephone"));
            }

            commandeService.modifierCommande(commande);
            System.out.println("✅ Commande #" + id + " modifiée");

            return ResponseEntity.ok(Map.of("success", true, "message", "Commande mise à jour"));

        } catch (Exception e) {
            System.err.println("❌ Erreur modification commande: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("success", false, "message", "Erreur: " + e.getMessage()));
        }
    }

    /**
     * PUT /api/commandes/{id}/statut
     * Modifie uniquement le statut d'une commande
     */
    @PutMapping("/{id}/statut")
    public ResponseEntity<?> modifierStatut(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            Commande commande = commandeService.getCommande(id);
            if (commande == null) {
                return ResponseEntity.notFound().build();
            }

            String nouveauStatut = body.get("statut");
            if (nouveauStatut == null || nouveauStatut.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Le statut est requis"));
            }

            commande.setStatut(nouveauStatut.trim());
            commandeService.modifierCommande(commande);
            System.out.println("✅ Statut commande #" + id + " → " + nouveauStatut);

            return ResponseEntity.ok(Map.of("success", true, "message", "Statut mis à jour"));

        } catch (Exception e) {
            System.err.println("❌ Erreur modification statut: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("success", false, "message", "Erreur: " + e.getMessage()));
        }
    }

    /**
     * DELETE /api/commandes/{id}
     * Supprime une commande
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> supprimerCommande(@PathVariable Long id) {
        try {
            Commande commande = commandeService.getCommande(id);
            if (commande == null) {
                return ResponseEntity.notFound().build();
            }

            commandeService.supprimerCommande(id);
            System.out.println("🗑️ Commande #" + id + " supprimée");

            return ResponseEntity.noContent().build();

        } catch (Exception e) {
            System.err.println("❌ Erreur suppression commande: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Erreur: " + e.getMessage()));
        }
    }

    /**
     * POST /api/commandes/valider
     * Valide le panier et crée une commande avec paiement
     */
    @PostMapping("/valider")
    public ResponseEntity<?> validerPanierEtPayer(@RequestBody Map<String, Object> data) {
        try {
            String email = (String) data.get("email");
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Email requis"));
            }

            Utilisateur user = utilisateurService.getUtilisateurByEmail(email.toLowerCase());
            if (user == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Utilisateur non trouvé"));
            }

            String typePaiement = (String) data.get("typePaiement");
            Object montantObj = data.get("montant");
            if (montantObj == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Montant requis"));
            }

            double montant = ((Number) montantObj).doubleValue();
            String recu = commandeService.validerPanierEtPayer(user, typePaiement, montant);
            
            return ResponseEntity.ok(Map.of("success", true, "recu", recu));

        } catch (Exception e) {
            System.err.println("❌ Erreur validation panier: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
