package com.bioelbaraka.dao;

import com.bioelbaraka.model.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaiementDAO extends JpaRepository<Paiement, Long> {
    // Ajoute ici des méthodes personnalisées si besoin
} 