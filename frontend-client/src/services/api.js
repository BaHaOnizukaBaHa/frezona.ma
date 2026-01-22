import axios from 'axios';
import { Capacitor } from '@capacitor/core';

/**
 * Service API - Configuration et intercepteurs Axios
 */

// ⚠️ CONFIGURATION API
// Local: utilise localhost
// Production (Vercel): utilise l'URL Railway via variable d'environnement
const SERVER_IP = '192.168.8.168';
const SERVER_PORT = '8082';

// URL du backend en production (Railway) - À configurer dans Vercel
const PRODUCTION_API_URL = process.env.REACT_APP_API_URL;

// Configuration de l'URL de base selon l'environnement
const getBaseURL = () => {
  const isNativePlatform = Capacitor.isNativePlatform();
  
  // Mode mobile (Capacitor)
  if (isNativePlatform) {
    const url = `http://${SERVER_IP}:${SERVER_PORT}/api`;
    console.log('📱 Mode mobile - API URL:', url);
    return url;
  }
  
  // En production (Vercel) - utiliser l'URL Railway
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Production: Vercel
    if (hostname.includes('vercel.app') || hostname.includes('frezona')) {
      const prodUrl = PRODUCTION_API_URL || 'https://votre-backend.railway.app/api';
      console.log('🌐 Mode production - API URL:', prodUrl);
      return prodUrl;
    }
    
    // Développement local
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      console.log('🖥️ Mode web local - API URL: http://localhost:8082/api');
      return 'http://localhost:8082/api';
    }
  }
  
  return `http://${SERVER_IP}:${SERVER_PORT}/api`;
};

// Instance Axios configurée
const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur de requête - Log pour débogage
api.interceptors.request.use(
  (config) => {
    console.log('🚀 Requête:', config.method?.toUpperCase(), config.url);
    console.log('📤 Données:', config.data);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Erreur requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur de réponse
api.interceptors.response.use(
  (response) => {
    console.log('✅ Réponse:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Erreur réponse:', error.message);
    
    if (error.response) {
      console.error('📥 Status:', error.response.status);
      console.error('📥 Data:', error.response.data);
    } else if (error.request) {
      console.error('🔌 Pas de réponse du serveur - Vérifiez:');
      console.error('   1. Le backend est-il lancé?');
      console.error('   2. L\'IP', SERVER_IP, 'est-elle correcte?');
      console.error('   3. Le port', SERVER_PORT, 'est-il ouvert dans le firewall?');
    }
    
    // Erreur 401: Token expiré
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/welcome') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
