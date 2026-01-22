package com.bioelbaraka.rest;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

/**
 * Contrôleur REST pour l'upload de fichiers (images) vers Cloudinary
 */
@RestController
@RequestMapping("/api/upload")
public class UploadResource {

    @Autowired
    private Cloudinary cloudinary;

    /**
     * POST /api/upload/image
     * Upload une image vers Cloudinary et retourne son URL
     */
    @PostMapping("/image")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // Vérifier si le fichier est vide
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Fichier vide"));
            }

            // Vérifier le type de fichier
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Le fichier doit être une image"));
            }

            // Vérifier la taille (max 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "L'image ne doit pas dépasser 5MB"));
            }

            System.out.println("📤 Upload vers Cloudinary...");

            // Upload vers Cloudinary
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                    "folder", "frezona",
                    "resource_type", "image",
                    "transformation", "q_auto,f_auto"
                )
            );

            // Récupérer l'URL sécurisée
            String imageUrl = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");

            System.out.println("✅ Image uploadée sur Cloudinary: " + imageUrl);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Image uploadée avec succès sur Cloudinary",
                "imageUrl", imageUrl,
                "publicId", publicId
            ));

        } catch (IOException e) {
            System.err.println("❌ Erreur upload Cloudinary: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Erreur lors de l'upload: " + e.getMessage()));
        }
    }

    /**
     * DELETE /api/upload/image/{publicId}
     * Supprime une image de Cloudinary
     */
    @DeleteMapping("/image/{publicId}")
    public ResponseEntity<?> deleteImage(@PathVariable String publicId) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            
            String resultStatus = (String) result.get("result");
            
            if ("ok".equals(resultStatus)) {
                System.out.println("🗑️ Image supprimée de Cloudinary: " + publicId);
                return ResponseEntity.ok(Map.of("success", true, "message", "Image supprimée"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Image non trouvée"));
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Erreur: " + e.getMessage()));
        }
    }
}
