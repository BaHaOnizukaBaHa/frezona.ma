package com.bioelbaraka.rest;

import com.bioelbaraka.model.PanierItem;
import com.bioelbaraka.model.Utilisateur;
import com.bioelbaraka.service.PanierService;
import com.bioelbaraka.service.UtilisateurService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/panier")
public class PanierResource {
    @Autowired
    private PanierService panierService;
    @Autowired
    private UtilisateurService utilisateurService;

    @GetMapping
    public List<PanierItem> getPanierItems(@RequestParam Long userId) {
        return panierService.getItems(userId);
    }

    @PostMapping
    public ResponseEntity<Void> ajouterAuPanier(@RequestParam Long userId, @RequestParam Long produitId, @RequestParam int quantite) {
        panierService.ajouterProduit(userId, produitId, quantite);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> modifierQuantite(@RequestParam Long userId, @RequestParam Long produitId, @RequestParam int quantite) {
        panierService.modifierQuantite(userId, produitId, quantite);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerDuPanier(@RequestParam Long userId, @RequestParam Long produitId) {
        panierService.supprimerProduit(userId, produitId);
        return ResponseEntity.noContent().build();
    }
} 