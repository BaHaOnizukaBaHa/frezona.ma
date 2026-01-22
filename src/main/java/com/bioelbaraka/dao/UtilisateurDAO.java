package com.bioelbaraka.dao;

import com.bioelbaraka.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UtilisateurDAO extends JpaRepository<Utilisateur, Long> {
    // Ajoute ici des méthodes personnalisées si besoin
    Optional<Utilisateur> findByEmail(String email);
} 