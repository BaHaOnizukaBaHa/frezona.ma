package com.bioelbaraka.dao;

import com.bioelbaraka.model.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProduitDAO extends JpaRepository<Produit, Long> {
    // Ajoute ici des méthodes personnalisées si besoin
} 