import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Welcome.css';

/**
 * Page d'accueil de bienvenue
 * S'affiche au premier lancement de l'application
 */
const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Si déjà connecté, rediriger vers l'accueil
  React.useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  return (
    <div className="welcome-container">
      {/* Fond animé */}
      <div className="welcome-bg">
        <div className="welcome-circle circle-1"></div>
        <div className="welcome-circle circle-2"></div>
        <div className="welcome-circle circle-3"></div>
      </div>

      {/* Contenu principal */}
      <div className="welcome-content">
        {/* Logo */}
        <div className="welcome-logo">
          <span className="logo-icon">🌿</span>
          <h1 className="logo-text">Frezona</h1>
          <p className="logo-tagline">Produits bio & frais</p>
        </div>

        {/* Illustration */}
        <div className="welcome-illustration">
          <div className="illustration-items">
            <span className="item item-1">🥬</span>
            <span className="item item-2">🍎</span>
            <span className="item item-3">🥕</span>
            <span className="item item-4">🍋</span>
            <span className="item item-5">🥑</span>
            <span className="item item-6">🍇</span>
          </div>
        </div>

        {/* Message de bienvenue */}
        <div className="welcome-message">
          <h2>Bienvenue chez Frezona</h2>
          <p>Découvrez nos produits biologiques, frais et locaux. 
             Livraison rapide directement chez vous.</p>
        </div>

        {/* Fonctionnalités */}
        <div className="welcome-features">
          <div className="feature">
            <span className="feature-icon">🚚</span>
            <span className="feature-text">Livraison rapide</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🌱</span>
            <span className="feature-text">100% Bio</span>
          </div>
          <div className="feature">
            <span className="feature-icon">💚</span>
            <span className="feature-text">Qualité garantie</span>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="welcome-actions">
          <button 
            className="btn-primary"
            onClick={() => navigate('/login')}
          >
            Se connecter
          </button>
          <button 
            className="btn-secondary"
            onClick={() => navigate('/register')}
          >
            Créer un compte
          </button>
        </div>

        {/* Lien pour explorer sans compte */}
        <button 
          className="btn-explore"
          onClick={() => navigate('/home')}
        >
          Explorer sans compte →
        </button>
      </div>
    </div>
  );
};

export default Welcome;

