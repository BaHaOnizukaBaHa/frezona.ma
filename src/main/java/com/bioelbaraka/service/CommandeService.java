package com.bioelbaraka.service;

import com.bioelbaraka.dao.CommandeDAO;
import com.bioelbaraka.dao.PanierDAO;
import com.bioelbaraka.model.Commande;
import com.bioelbaraka.model.Panier;
import com.bioelbaraka.model.PanierItem;
import com.bioelbaraka.model.Paiement;
import com.bioelbaraka.model.Utilisateur;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Date;
import java.util.List;

@Service
public class CommandeService {
    @Autowired
    private CommandeDAO commandeDAO;
    @Autowired
    private PanierDAO panierDAO;
    @Autowired
    private PaiementService paiementService;

    public void ajouterCommande(Commande commande) {
        commandeDAO.save(commande);
    }

    public Commande getCommande(Long id) {
        return commandeDAO.findById(id).orElse(null);
    }

    public List<Commande> getAllCommandes() {
        return commandeDAO.findAll();
    }

    public void modifierCommande(Commande commande) {
        commandeDAO.save(commande);
    }

    public void supprimerCommande(Long id) {
        commandeDAO.deleteById(id);
    }

    public List<Commande> getCommandesByUtilisateur(Utilisateur utilisateur) {
        return commandeDAO.findByUtilisateurOrderByDateDesc(utilisateur);
    }

    public List<Commande> getCommandesByEmail(String email) {
        return commandeDAO.findByEmailOrderByDateDesc(email);
    }

    public String validerPanierEtPayer(Utilisateur utilisateur, String typePaiement, double montant) throws Exception {
        Panier panier = panierDAO.findByUtilisateurId(utilisateur.getId()).orElse(null);
        if (panier == null || panier.getItems().isEmpty()) {
            throw new Exception("Panier vide");
        }
        // Création de la commande
        Commande commande = new Commande();
        commande.setUtilisateur(utilisateur);
        commande.setDate(new Date());
        commande.setTotal(montant);
        commande.setStatut("EN_COURS");
        // Copie des infos de livraison du panier
        commande.setEmail(panier.getEmail());
        commande.setVille(panier.getVille());
        commande.setAdresseLivraison(panier.getAdresseLivraison());
        commande.setPrenom(panier.getPrenom());
        commande.setTelephone(panier.getTelephone());
        commandeDAO.save(commande);
        // Paiement
        Paiement paiement;
        if ("stripe".equalsIgnoreCase(typePaiement)) {
            paiement = paiementService.payerEnLigne(utilisateur, commande, montant);
        } else {
            paiement = paiementService.payerALaLivraison(utilisateur, commande, montant);
        }
        // Vider le panier
        panier.getItems().clear();
        panierDAO.save(panier);
        return paiement.getRecu();
    }
} 