package com.bioelbaraka.dao;

import com.bioelbaraka.model.MediaProduit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MediaProduitDAO extends JpaRepository<MediaProduit, Long> {
    // Ajoute ici des méthodes personnalisées si besoin
} 