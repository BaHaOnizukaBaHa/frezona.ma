package com.bioelbaraka.rest;

import com.bioelbaraka.model.Utilisateur;
import com.bioelbaraka.service.UtilisateurService;
import io.jsonwebtoken.Jwts;
import javax.crypto.SecretKey;
import io.jsonwebtoken.security.Keys;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.Base64;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Contrôleur REST pour la gestion de l'authentification
 * Endpoints: /api/auth/login, /api/auth/register, /api/auth/google
 */
@RestController
@RequestMapping("/api/auth")
public class AuthResource {
    
    // Clé secrète pour JWT - En production, utiliser une variable d'environnement
    private static final String SECRET_KEY_STRING = "BioElBarakaSecretKey2024VeryLongAndSecureForJWTTokenGeneration123456789";
    private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(SECRET_KEY_STRING.getBytes());
    private static final long EXPIRATION_TIME = 86400000; // 24 heures en ms
    
    // Patterns de validation
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    );
    private static final Pattern PHONE_PATTERN = Pattern.compile(
        "^(0|\\+212)[5-7][0-9]{8}$"
    );

    @Autowired
    private UtilisateurService utilisateurService;

    /**
     * Génère un token JWT pour un utilisateur
     */
    private String generateToken(Utilisateur user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole())
                .claim("nom", user.getNom())
                .claim("prenom", user.getPrenom())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY)
                .compact();
    }

    /**
     * Crée une réponse d'authentification réussie
     */
    private Map<String, Object> createAuthResponse(Utilisateur user, String token, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("role", user.getRole());
        response.put("email", user.getEmail());
        response.put("nom", user.getNom());
        response.put("prenom", user.getPrenom());
        if (message != null) {
            response.put("message", message);
        }
        return response;
    }

    /**
     * Valide le format d'un email
     */
    private boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }

    /**
     * Valide le format d'un numéro de téléphone marocain
     */
    private boolean isValidPhone(String phone) {
        if (phone == null || phone.isEmpty()) return false;
        return PHONE_PATTERN.matcher(phone.replace(" ", "")).matches();
    }

    /**
     * POST /api/auth/login
     * Connexion d'un utilisateur avec email et mot de passe
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String motDePasse = credentials.get("motDePasse");

            // Validation des champs
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "L'email est obligatoire"));
            }
            if (motDePasse == null || motDePasse.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Le mot de passe est obligatoire"));
            }

            // Recherche de l'utilisateur
            Utilisateur user = utilisateurService.getUtilisateurByEmail(email.trim().toLowerCase());
            
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Email ou mot de passe incorrect"));
            }

            // Vérification du mot de passe
            if (!motDePasse.equals(user.getMotDePasse())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Email ou mot de passe incorrect"));
            }

            // Génération du token et réponse
            String token = generateToken(user);
            return ResponseEntity.ok(createAuthResponse(user, token, null));

        } catch (Exception e) {
            System.err.println("Erreur login: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Erreur lors de la connexion"));
        }
    }

    /**
     * POST /api/auth/register
     * Inscription d'un nouvel utilisateur
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Utilisateur utilisateur) {
        try {
            // Validation du prénom
            if (utilisateur.getPrenom() == null || utilisateur.getPrenom().trim().length() < 2) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Le prénom doit contenir au moins 2 caractères"));
            }

            // Validation du nom
            if (utilisateur.getNom() == null || utilisateur.getNom().trim().length() < 2) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Le nom doit contenir au moins 2 caractères"));
            }

            // Validation de l'email
            if (utilisateur.getEmail() == null || utilisateur.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "L'email est obligatoire"));
            }
            if (!isValidEmail(utilisateur.getEmail())) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Format d'email invalide (ex: exemple@gmail.com)"));
            }

            // Normaliser l'email (minuscules)
            utilisateur.setEmail(utilisateur.getEmail().trim().toLowerCase());

            // Vérifier si l'email existe déjà
            if (utilisateurService.getUtilisateurByEmail(utilisateur.getEmail()) != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Cet email est déjà utilisé"));
            }

            // Validation du mot de passe
            if (utilisateur.getMotDePasse() == null || utilisateur.getMotDePasse().length() < 6) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Le mot de passe doit contenir au moins 6 caractères"));
            }

            // Validation du téléphone
            if (utilisateur.getNumeroTelephone() == null || utilisateur.getNumeroTelephone().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Le numéro de téléphone est obligatoire"));
            }
            if (!isValidPhone(utilisateur.getNumeroTelephone())) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Format de téléphone invalide (ex: 0612345678)"));
            }

            // Définir le rôle par défaut
            if (utilisateur.getRole() == null || utilisateur.getRole().isEmpty()) {
                utilisateur.setRole("USER");
            }

            // Nettoyer les données
            utilisateur.setNom(utilisateur.getNom().trim());
            utilisateur.setPrenom(utilisateur.getPrenom().trim());
            utilisateur.setNumeroTelephone(utilisateur.getNumeroTelephone().replace(" ", ""));

            // Sauvegarder l'utilisateur
            utilisateurService.ajouterUtilisateur(utilisateur);
            System.out.println("✅ Nouvel utilisateur inscrit: " + utilisateur.getEmail());

            // Générer le token et retourner la réponse
            String token = generateToken(utilisateur);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(createAuthResponse(utilisateur, token, "Inscription réussie !"));

        } catch (Exception e) {
            System.err.println("❌ Erreur inscription: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Erreur lors de l'inscription: " + e.getMessage()));
        }
    }

    /**
     * POST /api/auth/google
     * Connexion/Inscription via Google OAuth
     */
    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) {
        try {
            String credential = body.get("credential");
            
            if (credential == null || credential.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Token Google manquant"));
            }

            // Décoder le token JWT de Google
            String[] parts = credential.split("\\.");
            if (parts.length < 2) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Token Google invalide"));
            }

            // Décoder le payload
            String payload = new String(Base64.getUrlDecoder().decode(parts[1]));
            ObjectMapper mapper = new ObjectMapper();
            @SuppressWarnings("unchecked")
            Map<String, Object> googleData = mapper.readValue(payload, Map.class);

            String email = (String) googleData.get("email");
            String givenName = (String) googleData.get("given_name");
            String familyName = (String) googleData.get("family_name");
            Boolean emailVerified = (Boolean) googleData.get("email_verified");

            // Vérifier que l'email est vérifié
            if (emailVerified == null || !emailVerified) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "L'email Google n'est pas vérifié"));
            }

            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email non fourni par Google"));
            }

            email = email.toLowerCase();
            System.out.println("🔐 Connexion Google: " + email);

            // Chercher ou créer l'utilisateur
            Utilisateur user = utilisateurService.getUtilisateurByEmail(email);

            if (user == null) {
                // Créer un nouvel utilisateur
                user = new Utilisateur();
                user.setEmail(email);
                user.setPrenom(givenName != null ? givenName : "");
                user.setNom(familyName != null ? familyName : "");
                user.setRole("USER");
                user.setMotDePasse("GOOGLE_AUTH_" + System.currentTimeMillis());
                user.setNumeroTelephone("");
                
                utilisateurService.ajouterUtilisateur(user);
                System.out.println("✅ Nouvel utilisateur Google créé: " + email);
            }

            // Générer le token et retourner la réponse
            String token = generateToken(user);
            return ResponseEntity.ok(createAuthResponse(user, token, "Connexion Google réussie"));

        } catch (Exception e) {
            System.err.println("❌ Erreur Google OAuth: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Erreur lors de la connexion Google"));
        }
    }
}
