import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let userName = '';
  if (token) {
    const payload = parseJwt(token);
    // On suppose que le nom et prénom sont stockés dans le JWT (sinon, à adapter)
    userName = payload && (payload.nom || payload.name || '') + (payload.prenom ? ' ' + payload.prenom : '');
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header style={{ padding: '1rem', background: '#222', color: '#fff' }}>
      <nav>
        <Link to="/" style={{ color: '#fff', marginRight: 16 }}>Accueil</Link>
        <Link to="/produits" style={{ color: '#fff', marginRight: 16 }}>Produits</Link>
        <Link to="/panier" style={{ color: '#fff', marginRight: 16 }}>Panier</Link>
        {token ? (
          <>
            <span style={{ color: '#F8F4E3', marginRight: 16, fontWeight: 500 }}>
              {userName && `Bienvenue, ${userName}`}
            </span>
            <Link to="/profil" style={{ color: '#fff', marginRight: 16 }}>Profil</Link>
            <Link to="/commandes" style={{ color: '#fff', marginRight: 16 }}>Commandes</Link>
            <button onClick={handleLogout} className="btn" style={{ marginLeft: 16 }}>Déconnexion</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff', marginRight: 16 }}>Connexion</Link>
            <Link to="/register" style={{ color: '#fff' }}>Inscription</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header; 