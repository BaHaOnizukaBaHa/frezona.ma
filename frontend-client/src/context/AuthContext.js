import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

/**
 * Provider pour la gestion de l'authentification
 * - Connexion/Déconnexion
 * - Inscription
 * - Connexion Google OAuth
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Initialisation: Récupère l'utilisateur depuis localStorage
   */
  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (e) {
        console.error('Erreur initialisation auth:', e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Sauvegarde l'utilisateur dans l'état et localStorage
   */
  const saveUserSession = useCallback((userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    window.dispatchEvent(new CustomEvent('userLoggedIn'));
  }, []);

  /**
   * Connexion avec email et mot de passe
   */
  const login = useCallback(async (email, password) => {
    try {
      const response = await api.post('/auth/login', { 
        email: email.trim().toLowerCase(), 
        motDePasse: password 
      });
      
      const { token, role, nom, prenom, email: userEmail } = response.data;
      
      const userData = {
        email: userEmail,
        role,
        nom,
        prenom
      };
      
      saveUserSession(userData, token);
      return { success: true };

    } catch (error) {
      const message = error.response?.data?.message || 
                      error.response?.data || 
                      'Email ou mot de passe incorrect';
      return { success: false, error: message };
    }
  }, [saveUserSession]);

  /**
   * Inscription d'un nouvel utilisateur
   */
  const register = useCallback(async (userData) => {
    try {
      const response = await api.post('/auth/register', {
        ...userData,
        email: userData.email.trim().toLowerCase()
      });
      
      const { token, role, nom, prenom, email: userEmail, message } = response.data;
      
      const newUser = {
        email: userEmail,
        role,
        nom,
        prenom
      };
      
      saveUserSession(newUser, token);
      return { success: true, message: message || 'Inscription réussie !' };

    } catch (error) {
      const message = error.response?.data?.message || 
                      error.response?.data || 
                      'Erreur lors de l\'inscription';
      return { success: false, error: message };
    }
  }, [saveUserSession]);

  /**
   * Connexion via Google OAuth
   */
  const googleLogin = useCallback(async (googleCredential) => {
    try {
      const response = await api.post('/auth/google', { 
        credential: googleCredential 
      });
      
      const { token, role, nom, prenom, email: userEmail } = response.data;
      
      const googleUser = {
        email: userEmail,
        role,
        nom,
        prenom
      };
      
      saveUserSession(googleUser, token);
      return { success: true };

    } catch (error) {
      const message = error.response?.data?.message || 
                      'Erreur de connexion Google';
      return { success: false, error: message };
    }
  }, [saveUserSession]);

  /**
   * Déconnexion
   */
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.dispatchEvent(new CustomEvent('userLoggedOut'));
  }, []);

  /**
   * Vérifie si l'utilisateur est admin
   */
  const isAdmin = useCallback(() => {
    return user?.role === 'ADMIN';
  }, [user]);

  /**
   * Vérifie si l'utilisateur est connecté
   */
  const isAuthenticated = useCallback(() => {
    return !!user && !!localStorage.getItem('token');
  }, [user]);

  const value = {
    user,
    login,
    register,
    logout,
    googleLogin,
    loading,
    isAdmin,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
