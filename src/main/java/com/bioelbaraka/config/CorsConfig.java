package com.bioelbaraka.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

/**
 * Configuration CORS globale pour permettre les connexions depuis:
 * - L'application web (localhost)
 * - L'application mobile (Capacitor)
 * - Toutes les adresses IP du réseau local
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        
        // Autoriser toutes les origines pour le développement
        corsConfiguration.setAllowCredentials(false);
        corsConfiguration.addAllowedOriginPattern("*");
        
        // Autoriser tous les headers
        corsConfiguration.addAllowedHeader("*");
        
        // Autoriser toutes les méthodes HTTP
        corsConfiguration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));
        
        // Exposer les headers nécessaires
        corsConfiguration.setExposedHeaders(Arrays.asList(
            "Authorization", "Content-Type", "Accept"
        ));
        
        // Durée de cache du preflight
        corsConfiguration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        
        return new CorsFilter(source);
    }
}

