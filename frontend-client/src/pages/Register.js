import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
    telephone: '',
    adresse: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Fonction de validation d'email
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Fonction de validation du numéro de téléphone marocain
  const isValidPhone = (phone) => {
    const phoneRegex = /^(0|\+212)[5-7][0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  // Gestion de la connexion Google
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    
    const result = await googleLogin(credentialResponse.credential);
    
    if (result.success) {
      setSuccess('Connexion Google réussie !');
      setTimeout(() => {
        navigate('/home');
      }, 1500);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleGoogleError = () => {
    setError('La connexion Google a échoué. Veuillez réessayer.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation du nom
    if (!formData.nom || formData.nom.trim().length < 2) {
      setError('Le nom doit contenir au moins 2 caractères');
      return;
    }

    // Validation du prénom
    if (!formData.prenom || formData.prenom.trim().length < 2) {
      setError('Le prénom doit contenir au moins 2 caractères');
      return;
    }

    // Validation de l'email
    if (!isValidEmail(formData.email)) {
      setError('Veuillez entrer une adresse email valide (ex: exemple@gmail.com)');
      return;
    }

    // Validation du téléphone
    if (!isValidPhone(formData.telephone)) {
      setError('Veuillez entrer un numéro de téléphone valide (ex: 0612345678)');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    const userData = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      motDePasse: formData.password,
      numeroTelephone: formData.telephone,
      role: "USER" // Rôle par défaut
    };

    const result = await register(userData);
    
    if (result.success) {
      setSuccess(result.message || 'Inscription réussie et connexion automatique !');
      // Rediriger vers la page d'accueil après 2 secondes
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Créer un compte</h2>
        <p>Rejoignez Frezona.ma et découvrez nos légumes et fruits frais</p>
        
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        {/* Bouton Google OAuth en haut */}
        <div className="google-login-section">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            theme="outline"
            size="large"
            text="signup_with"
            shape="rectangular"
            logo_alignment="center"
            width="100%"
          />
        </div>

        <div className="divider">
          <span>ou inscrivez-vous avec votre email</span>
        </div>
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prenom" className="form-label">Prénom</label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="nom" className="form-label">Nom</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
              autoComplete="username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="telephone" className="form-label">Téléphone</label>
            <input
              type="tel"
              id="telephone"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="adresse" className="form-label">Adresse</label>
            <textarea
              id="adresse"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              className="form-input"
              rows="3"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              required
              autoComplete="new-password"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input"
              required
              autoComplete="new-password"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary register-btn"
            disabled={loading}
          >
            {loading ? 'Création du compte...' : 'Créer mon compte'}
          </button>
        </form>
        
        <div className="register-footer">
          <p>
            Déjà un compte ?{' '}
            <Link to="/login" className="link">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
