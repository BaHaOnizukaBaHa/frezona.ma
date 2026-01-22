import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

/**
 * Génère la clé localStorage pour le panier d'un utilisateur
 */
const getCartKey = (userEmail) => {
  return userEmail ? `cart_${userEmail}` : 'cart_guest';
};

/**
 * Provider pour la gestion du panier
 * - Chaque utilisateur a son propre panier
 * - Les paniers sont stockés dans localStorage
 */
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);

  /**
   * Charge le panier d'un utilisateur depuis localStorage
   */
  const loadUserCart = useCallback((userEmail) => {
    try {
      const cartKey = getCartKey(userEmail);
      const savedCart = localStorage.getItem(cartKey);
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];
      
      setCart(parsedCart);
      setCurrentUserEmail(userEmail);
      setIsGuest(!userEmail);
    } catch (error) {
      console.error('Erreur chargement panier:', error);
      setCart([]);
    }
  }, []);

  /**
   * Initialisation: Charge le panier au démarrage
   */
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        loadUserCart(parsedUser.email);
      } catch (e) {
        loadUserCart(null);
      }
    } else {
      loadUserCart(null);
    }
    setLoading(false);
  }, [loadUserCart]);

  /**
   * Écoute les événements de connexion/déconnexion
   */
  useEffect(() => {
    const handleUserLogin = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setIsGuest(false);
          loadUserCart(parsedUser.email);
        } catch (e) {
          console.error('Erreur lors du changement de panier');
        }
      }
    };

    const handleUserLogout = () => {
      // Sauvegarder le panier actuel avant de changer
      if (currentUserEmail) {
        const cartKey = getCartKey(currentUserEmail);
        localStorage.setItem(cartKey, JSON.stringify(cart));
      }
      
      setIsGuest(true);
      loadUserCart(null);
    };

    window.addEventListener('userLoggedIn', handleUserLogin);
    window.addEventListener('userLoggedOut', handleUserLogout);
    
    return () => {
      window.removeEventListener('userLoggedIn', handleUserLogin);
      window.removeEventListener('userLoggedOut', handleUserLogout);
    };
  }, [loadUserCart, currentUserEmail, cart]);

  /**
   * Sauvegarde automatique du panier dans localStorage
   */
  useEffect(() => {
    if (!loading) {
      const cartKey = getCartKey(currentUserEmail);
      localStorage.setItem(cartKey, JSON.stringify(cart));
    }
  }, [cart, loading, currentUserEmail]);

  /**
   * Ajoute un produit au panier
   */
  const addToCart = useCallback((produit, quantite = 1) => {
    if (!produit || !produit.id) {
      console.error('Produit invalide');
      return;
    }

    setCart(prev => {
      const existingItem = prev.find(item => item.id === produit.id);
      
      if (existingItem) {
        return prev.map(item => 
          item.id === produit.id 
            ? { ...item, quantite: item.quantite + quantite } 
            : item
        );
      }
      
      return [...prev, { 
        id: produit.id,
        nom: produit.nom,
        prix: produit.prix,
        imageUrl: produit.imageUrl,
        quantite 
      }];
    });
  }, []);

  /**
   * Supprime un produit du panier
   */
  const removeFromCart = useCallback((id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  /**
   * Met à jour la quantité d'un produit
   */
  const updateQuantity = useCallback((id, quantite) => {
    if (quantite <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantite } : item
    ));
  }, [removeFromCart]);

  /**
   * Vide le panier
   */
  const clearCart = useCallback(() => {
    setCart([]);
    const cartKey = getCartKey(currentUserEmail);
    localStorage.removeItem(cartKey);
  }, [currentUserEmail]);

  /**
   * Retourne le nombre total d'articles dans le panier
   */
  const getCartItemCount = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantite, 0);
  }, [cart]);

  /**
   * Retourne le montant total du panier
   */
  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + (item.prix * item.quantite), 0);
  }, [cart]);

  /**
   * Synchronisation (placeholder pour future implémentation serveur)
   */
  const syncCartOnLogin = useCallback(async () => {
    console.log('Panier synchronisé');
  }, []);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loading,
    isGuest,
    syncCartOnLogin,
    getCartItemCount,
    getCartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
