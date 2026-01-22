package com.bioelbaraka.rest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

/**
 * Contrôleur REST pour l'upload de fichiers (images)
 */
@RestController
@RequestMapping("/api/upload")
public class UploadResource {

    // Chemin absolu vers le dossier public du frontend
    private String getUploadDir() {
        // Obtenir le répertoire du projet
        String userDir = System.getProperty("user.dir");
        // Construire le chemin vers frontend-client/public/uploads
        return userDir + File.separator + "frontend-client" + File.separator + "public" + File.separator + "uploads" + File.separator;
    }

    /**
     * POST /api/upload/image
     * Upload une image et retourne son URL
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

            // Créer le dossier uploads s'il n'existe pas
            String uploadPath = getUploadDir();
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }
            
            System.out.println("📁 Dossier upload: " + uploadPath);

            // Générer un nom unique pour le fichier
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String newFilename = UUID.randomUUID().toString() + extension;

            // Sauvegarder le fichier
            Path targetPath = Paths.get(uploadPath + newFilename);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            
            System.out.println("💾 Fichier sauvegardé: " + targetPath.toAbsolutePath());

            // Retourner l'URL de l'image
            String imageUrl = "/uploads/" + newFilename;
            
            System.out.println("✅ Image uploadée: " + imageUrl);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Image uploadée avec succès",
                "imageUrl", imageUrl,
                "filename", newFilename
            ));

        } catch (IOException e) {
            System.err.println("❌ Erreur upload: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Erreur lors de l'upload: " + e.getMessage()));
        }
    }

    /**
     * DELETE /api/upload/image/{filename}
     * Supprime une image
     */
    @DeleteMapping("/image/{filename}")
    public ResponseEntity<?> deleteImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(getUploadDir() + filename);
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                System.out.println("🗑️ Image supprimée: " + filename);
                return ResponseEntity.ok(Map.of("success", true, "message", "Image supprimée"));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Erreur: " + e.getMessage()));
        }
    }
}

