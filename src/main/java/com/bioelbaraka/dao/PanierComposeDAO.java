package com.bioelbaraka.dao;

import com.bioelbaraka.model.PanierCompose;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PanierComposeDAO extends JpaRepository<PanierCompose, Long> {
    List<PanierCompose> findByActifTrue();
}

