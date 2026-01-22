package com.bioelbaraka.dao;

import com.bioelbaraka.model.Commande;
import com.bioelbaraka.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommandeDAO extends JpaRepository<Commande, Long> {
    // Trouver les commandes d'un utilisateur
    List<Commande> findByUtilisateurOrderByDateDesc(Utilisateur utilisateur);
    
    // Trouver les commandes par email
    List<Commande> findByEmailOrderByDateDesc(String email);
} 