import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantite, 0);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <Link to="/home" className="navbar-brand">
          <img src="/f.png" alt="Frezona Logo" className="navbar-logo" />
          <span className="navbar-brand-text">Frezona.ma</span>
        </Link>
        
        {/* Navigation principale */}
        <div className="navbar-nav">
          <Link to="/home" className="nav-link">Accueil</Link>
          <Link to="/products" className="nav-link">Produits</Link>
          <Link to="/cart" className="nav-link">
            Panier
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </Link>
          {/* Lien Mes Commandes - visible pour les utilisateurs connectés */}
          {user && (
            <Link to="/orders" className="nav-link orders-link">
              📦 Mes Commandes
            </Link>
          )}
          {/* Lien Admin - visible seulement pour les administrateurs */}
          {user && user.role === 'ADMIN' && (
            <Link to="/admin" className="nav-link admin-link">
              🔧 Admin
            </Link>
          )}
        </div>

        {/* Actions utilisateur */}
        <div className="navbar-actions">
          {/* Authentification */}
          <div className="auth-container">
            {user ? (
              <>
                <span className="user-greeting">
                  Bonjour, {user.prenom && user.nom ? `${user.prenom} ${user.nom}` : (user.nom || user.email)}
                </span>
                <button onClick={handleLogout} className="auth-button logout-btn">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="auth-button login-btn">
                  Connexion
                </Link>
                <Link to="/register" className="auth-button register-btn">
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 