package com.bioelbaraka.rest;

import com.bioelbaraka.model.Commande;
import com.bioelbaraka.model.Paiement;
import com.bioelbaraka.model.Utilisateur;
import com.bioelbaraka.service.PaiementService;
import com.bioelbaraka.service.UtilisateurService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.Map;

@RestController
@RequestMapping("/paiements")
public class PaiementResource {
    @Autowired
    private PaiementService paiementService;
    @Autowired
    private UtilisateurService utilisateurService;

    @PostMapping("/stripe")
    public ResponseEntity<Paiement> payerStripe(@RequestBody Map<String, Object> data) {
        try {
            String email = (String) data.get("email");
            Utilisateur user = utilisateurService.getUtilisateurByEmail(email);
            // À adapter : récupération de la commande réelle
            Commande commande = null;
            double montant = ((Number) data.get("montant")).doubleValue();
            Paiement paiement = paiementService.payerEnLigne(user, commande, montant);
            return ResponseEntity.ok(paiement);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/livraison")
    public ResponseEntity<Paiement> payerALaLivraison(@RequestBody Map<String, Object> data) {
        String email = (String) data.get("email");
        Utilisateur user = utilisateurService.getUtilisateurByEmail(email);
        // À adapter : récupération de la commande réelle
        Commande commande = null;
        double montant = ((Number) data.get("montant")).doubleValue();
        Paiement paiement = paiementService.payerALaLivraison(user, commande, montant);
        return ResponseEntity.ok(paiement);
    }
} 