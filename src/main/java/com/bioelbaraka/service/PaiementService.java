package com.bioelbaraka.service;

import com.bioelbaraka.dao.PaiementDAO;
import com.bioelbaraka.model.Commande;
import com.bioelbaraka.model.Paiement;
import com.bioelbaraka.model.Utilisateur;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Date;

@Service
public class PaiementService {
    @Autowired
    private PaiementDAO paiementDAO;

    // Clé secrète Stripe (à remplacer par ta vraie clé en prod)
    private static final String STRIPE_SECRET_KEY = "sk_test_...";

    public Paiement payerEnLigne(Utilisateur utilisateur, Commande commande, double montant) throws StripeException {
        Stripe.apiKey = STRIPE_SECRET_KEY;
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount((long) (montant * 100)) // Stripe attend les montants en centimes
                .setCurrency("eur")
                .setDescription("Paiement commande ElBarakaBio")
                .build();
        PaymentIntent intent = PaymentIntent.create(params);
        Paiement paiement = new Paiement();
        paiement.setUtilisateur(utilisateur);
        paiement.setCommande(commande);
        paiement.setType("stripe");
        paiement.setStatut("SUCCES");
        paiement.setMontant(montant);
        paiement.setDate(new Date());
        paiement.setRecu(genererRecu(utilisateur, commande, montant, "stripe", "SUCCES"));
        paiementDAO.save(paiement);
        return paiement;
    }

    public Paiement payerALaLivraison(Utilisateur utilisateur, Commande commande, double montant) {
        Paiement paiement = new Paiement();
        paiement.setUtilisateur(utilisateur);
        paiement.setCommande(commande);
        paiement.setType("livraison");
        paiement.setStatut("EN_ATTENTE");
        paiement.setMontant(montant);
        paiement.setDate(new Date());
        paiement.setRecu(genererRecu(utilisateur, commande, montant, "livraison", "EN_ATTENTE"));
        paiementDAO.save(paiement);
        return paiement;
    }

    private String genererRecu(Utilisateur utilisateur, Commande commande, double montant, String type, String statut) {
        return "REÇU DE PAIEMENT\n" +
                "Client : " + utilisateur.getNom() + " (" + utilisateur.getEmail() + ")\n" +
                "Commande n° : " + (commande != null ? commande.getId() : "-") + "\n" +
                "Montant : " + montant + " EUR\n" +
                "Type : " + type + "\n" +
                "Statut : " + statut + "\n" +
                "Date : " + new Date() + "\n";
    }
} 