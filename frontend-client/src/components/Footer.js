import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Section principale */}
        <div className="footer-main">
          {/* Colonne Logo */}
          <div className="footer-brand">
            <div className="footer-logo">
              <img src="/f.png" alt="Frezona Logo" className="footer-logo-img" />
              <h3>Frezona<span>.ma</span></h3>
            </div>
            <p className="footer-description">
              Votre partenaire fraîcheur pour des produits de qualité. 
              Légumes, fruits frais et produits BIO livrés chez vous.
            </p>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <span>📘</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <span>📷</span>
              </a>
              <a href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer" className="social-link whatsapp">
                <span>💬</span>
              </a>
            </div>
          </div>

          {/* Colonne Liens rapides */}
          <div className="footer-column">
            <h4>Liens rapides</h4>
            <ul>
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/products">Nos produits</Link></li>
              <li><Link to="/products?categorie=frais">Légumes & Fruits</Link></li>
              <li><Link to="/products?categorie=bio">Produits BIO</Link></li>
              <li><Link to="/cart">Mon panier</Link></li>
            </ul>
          </div>

          {/* Colonne Service client */}
          <div className="footer-column">
            <h4>Service client</h4>
            <ul>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/legal">Mentions légales</Link></li>
              <li><Link to="/privacy">Politique de confidentialité</Link></li>
              <li><Link to="/returns">Retours & Remboursements</Link></li>
            </ul>
          </div>

          {/* Colonne Contact */}
          <div className="footer-column">
            <h4>Nous contacter</h4>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>Rabat, Maroc</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>+212 6 00 00 00 00</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span>contact@frezona.ma</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🕐</span>
                <span>Lun - Sam: 8h - 20h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <span>© {new Date().getFullYear()} Frezona.ma. Tous droits réservés.</span>
          </div>
          <div className="footer-credit">
            Made with ❤️ in Morocco
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
