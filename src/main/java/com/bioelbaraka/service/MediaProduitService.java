package com.bioelbaraka.service;

import com.bioelbaraka.dao.MediaProduitDAO;
import com.bioelbaraka.model.MediaProduit;
import com.bioelbaraka.model.Produit;
import com.bioelbaraka.util.CloudinaryUtil;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
public class MediaProduitService {
    @Autowired
    private MediaProduitDAO mediaProduitDAO;

    public void uploadMedia(File file, String type, Produit produit) throws IOException {
        String url = CloudinaryUtil.upload(file, "produits");
        MediaProduit media = new MediaProduit();
        media.setUrl(url);
        media.setType(type);
        media.setProduit(produit);
        mediaProduitDAO.save(media);
    }

    public List<MediaProduit> getMediasByProduit(Long produitId) {
        // À implémenter : méthode personnalisée dans MediaProduitDAO si besoin
        return null;
    }

    public void supprimerMedia(Long id) {
        mediaProduitDAO.deleteById(id);
    }

    public void updateMedia(Long mediaId, String type, String url, Produit produit) {
        mediaProduitDAO.findById(mediaId).ifPresent(media -> {
            if (type != null) media.setType(type);
            if (url != null) media.setUrl(url);
            if (produit != null) media.setProduit(produit);
            mediaProduitDAO.save(media);
        });
    }
} 