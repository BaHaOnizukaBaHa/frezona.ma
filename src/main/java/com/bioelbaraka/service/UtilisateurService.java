package com.bioelbaraka.service;

import com.bioelbaraka.dao.UtilisateurDAO;
import com.bioelbaraka.model.Utilisateur;
import com.bioelbaraka.model.Panier;
import com.bioelbaraka.dao.PanierDAO;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class UtilisateurService {
    @Autowired
    private UtilisateurDAO utilisateurDAO;

    @Autowired
    private PanierDAO panierDAO;

    public void ajouterUtilisateur(Utilisateur utilisateur) {
        utilisateurDAO.save(utilisateur);
        // Création automatique d'un panier vide lié à l'utilisateur
        Panier panier = new Panier();
        panier.setUtilisateur(utilisateur);
        panierDAO.save(panier); // migration vers Spring Data JPA
    }

    public Utilisateur getUtilisateur(Long id) {
        return utilisateurDAO.findById(id).orElse(null);
    }

    public Utilisateur getUtilisateurByEmail(String email) {
        return utilisateurDAO.findByEmail(email).orElse(null);
    }

    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurDAO.findAll();
    }

    public void modifierUtilisateur(Utilisateur utilisateur) {
        utilisateurDAO.save(utilisateur);
    }

    public void supprimerUtilisateur(Long id) {
        utilisateurDAO.deleteById(id);
    }
} 