import axios from 'axios';
import { Capacitor } from '@capacitor/core';

/**
 * Service API - Configuration et intercepteurs Axios
 */

// ⚠️ IMPORTANT: Mettez ici l'adresse IP de votre PC (trouvée avec ipconfig)
// Exemple: 192.168.1.X ou 192.168.0.X
const SERVER_IP = '192.168.8.168';
const SERVER_PORT = '8082';

// Configuration de l'URL de base selon l'environnement
const getBaseURL = () => {
  const isNativePlatform = Capacitor.isNativePlatform();
  
  if (isNativePlatform) {
    const url = `http://${SERVER_IP}:${SERVER_PORT}/api`;
    console.log('📱 Mode mobile - API URL:', url);
    return url;
  }
  
  // En développement web
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
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
