package com.bioelbaraka.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "paiements")
public class Paiement implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;

    @ManyToOne
    @JoinColumn(name = "commande_id")
    private Commande commande;

    private String type; // "stripe" ou "livraison"
    private String statut; // "SUCCES", "ECHEC", "EN_ATTENTE"
    private double montant;
    private String recu;

    @Temporal(TemporalType.TIMESTAMP)
    private Date date;

    // Getters et setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Utilisateur getUtilisateur() { return utilisateur; }
    public void setUtilisateur(Utilisateur utilisateur) { this.utilisateur = utilisateur; }
    public Commande getCommande() { return commande; }
    public void setCommande(Commande commande) { this.commande = commande; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
    public double getMontant() { return montant; }
    public void setMontant(double montant) { this.montant = montant; }
    public String getRecu() { return recu; }
    public void setRecu(String recu) { this.recu = recu; }
    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }
} 