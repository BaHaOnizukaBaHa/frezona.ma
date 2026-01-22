import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/home');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Connexion</h2>
        <p>Connectez-vous à votre compte Frezona.ma</p>
        
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
            text="signin_with"
            shape="rectangular"
            logo_alignment="center"
          />
        </div>

        <div className="divider">
          <span>ou connectez-vous avec votre email</span>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
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
            <label htmlFor="password" className="form-label">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              required
              autoComplete="current-password"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary login-btn"
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            Pas encore de compte ?{' '}
            <Link to="/register" className="link">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
