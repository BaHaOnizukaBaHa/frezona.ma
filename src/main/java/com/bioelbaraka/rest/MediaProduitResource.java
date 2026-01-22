package com.bioelbaraka.rest;

import com.bioelbaraka.model.MediaProduit;
import com.bioelbaraka.model.Produit;
import com.bioelbaraka.security.RolesAllowed;
import com.bioelbaraka.service.MediaProduitService;
import com.bioelbaraka.service.ProduitService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/media-produits")
public class MediaProduitResource {
    @Autowired
    private MediaProduitService mediaProduitService;
    @Autowired
    private ProduitService produitService;

    @PostMapping("/upload/{produitId}")
    @RolesAllowed({"admin"})
    public ResponseEntity<?> uploadMedia(@PathVariable Long produitId,
                                @RequestParam("type") String type,
                                @RequestParam("file") InputStream uploadedInputStream) {
        try {
            Produit produit = produitService.getProduit(produitId);
            if (produit == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Produit introuvable");
            // Sauvegarde temporaire du fichier
            File tempFile = File.createTempFile("upload", null);
            try (FileOutputStream out = new FileOutputStream(tempFile)) {
                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = uploadedInputStream.read(buffer)) != -1) {
                    out.write(buffer, 0, bytesRead);
                }
            }
            mediaProduitService.uploadMedia(tempFile, type, produit);
            tempFile.delete();
            return ResponseEntity.ok().body("Upload réussi");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur upload : " + e.getMessage());
        }
    }

    @GetMapping("/produit/{produitId}")
    public List<MediaProduit> getMediasByProduit(@PathVariable Long produitId) {
        return mediaProduitService.getMediasByProduit(produitId);
    }

    @DeleteMapping("/{mediaId}")
    @RolesAllowed({"admin"})
    public ResponseEntity<?> supprimerMedia(@PathVariable Long mediaId) {
        mediaProduitService.supprimerMedia(mediaId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{mediaId}")
    @RolesAllowed({"admin"})
    public ResponseEntity<?> modifierMedia(@PathVariable Long mediaId, @RequestBody Map<String, Object> data) {
        String nouveauType = (String) data.get("type");
        String nouvelleUrl = (String) data.get("url");
        Long produitId = data.get("produitId") != null ? ((Number) data.get("produitId")).longValue() : null;
        Produit nouveauProduit = null;
        if (produitId != null) {
            nouveauProduit = produitService.getProduit(produitId);
        }
        mediaProduitService.updateMedia(mediaId, nouveauType, nouvelleUrl, nouveauProduit);
        return ResponseEntity.ok().body("Média modifié");
    }
} 