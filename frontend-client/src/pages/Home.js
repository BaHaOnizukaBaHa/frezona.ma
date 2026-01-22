import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import './Home.css';

function Home() {
  const { addToCart } = useCart();
  const [selectedPanier, setSelectedPanier] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  const categories = [
    { id: 1, name: "Légumes & Fruits Frais", image: "/nor.jpeg", description: "Produits frais du jour", category: "frais" },
    { id: 2, name: "Produits BIO", image: "/bio.jpeg", description: "Légumes, fruits, huile d'olive, œufs et produits laitiers BIO", category: "bio" },
    { id: 3, name: "Rangement Panier en Osier", image: "/rangement.jpg", description: "Paniers artisanaux Hand Made", category: "rangement" }
  ];

  // Charger les paniers depuis l'API
  useEffect(() => {
    const fetchPaniers = async () => {
      try {
        const response = await api.get('/paniers-composes/actifs');
        // Transformer les données pour le format attendu
        const paniers = response.data.map((panier, index) => ({
          id: panier.id,
          nom: panier.nom,
          description: panier.description,
          prix: panier.prix,
          imageUrl: panier.imageUrl,
          category: index === 0 ? 'frais' : 'bio',
          isNew: true,
          constituants: panier.produits ? panier.produits.map(p => ({
            nom: p.nomProduit,
            quantite: p.quantiteDescription,
            icon: getProductIcon(p.nomProduit)
          })) : []
        }));
        setFeaturedProducts(paniers);
      } catch (error) {
        console.error('Erreur chargement paniers:', error);
        // Fallback avec données par défaut si l'API échoue
        setFeaturedProducts([]);
      }
    };
    fetchPaniers();
  }, []);

  // Fonction pour obtenir une icône basée sur le nom du produit
  const getProductIcon = (nomProduit) => {
    const nom = nomProduit.toLowerCase();
    if (nom.includes('pomme de terre') || nom.includes('patate')) return '🥔';
    if (nom.includes('oignon')) return '🧅';
    if (nom.includes('tomate')) return '🍅';
    if (nom.includes('légume') || nom.includes('legume')) return '🥬';
    if (nom.includes('beurre')) return '🧈';
    if (nom.includes('lait') || nom.includes('lben')) return '🥛';
    if (nom.includes('huile') || nom.includes('olive')) return '🫒';
    if (nom.includes('oeuf') || nom.includes('œuf')) return '🥚';
    if (nom.includes('emballage') || nom.includes('panier')) return '🧺';
    if (nom.includes('carotte')) return '🥕';
    if (nom.includes('salade')) return '🥗';
    return '🌿';
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation(); // Empêcher l'ouverture du modal
    addToCart(product, 1);
    // Animation feedback
    const btn = e.target;
    btn.classList.add('added');
    setTimeout(() => btn.classList.remove('added'), 1000);
  };

  const openPanierModal = (product) => {
    setSelectedPanier(product);
  };

  const closePanierModal = () => {
    setSelectedPanier(null);
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-badge">Livraison Rabat, Salé & Témara</span>
            <h1>
              Produits <span>Frais</span> & <span>BIO</span><br />
              Livrés chez vous
            </h1>
            <p>
              Découvrez notre sélection de légumes, fruits frais et produits BIO 
              directement de la ferme à votre table. Qualité garantie, fraîcheur assurée.
            </p>
            <div className="hero-buttons">
              <Link to="/products" className="hero-btn hero-btn-primary">
                🛒 Voir nos produits
              </Link>
              <Link to="/products?categorie=bio" className="hero-btn hero-btn-secondary">
                🌿 Découvrir le BIO
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Frais & Naturel</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Clients satisfaits</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img src="/nor.jpeg" alt="Légumes frais" />
            <div className="hero-floating-card delivery">
              <span className="floating-icon">🚚</span>
              <div>
                <div className="floating-text">Livraison Express</div>
                <div className="floating-subtext">Rabat, Salé & Témara</div>
              </div>
            </div>
            <div className="hero-floating-card quality">
              <span className="floating-icon">✅</span>
              <div>
                <div className="floating-text">Qualité Premium</div>
                <div className="floating-subtext">Produits sélectionnés</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Avantages */}
      <section className="benefits-section">
        <div className="benefit-card">
          <span className="benefit-icon">🥬</span>
          <h3>Produits Frais</h3>
          <p>Légumes et fruits cueillis à maturité</p>
        </div>
        <div className="benefit-card">
          <span className="benefit-icon">🌿</span>
          <h3>100% BIO</h3>
          <p>Agriculture biologique certifiée</p>
        </div>
        <div className="benefit-card">
          <span className="benefit-icon">🚚</span>
          <h3>Livraison Rapide</h3>
          <p>Livraison à domicile</p>
        </div>
        <div className="benefit-card">
          <span className="benefit-icon">💳</span>
          <h3>Paiement Facile</h3>
          <p>Paiement à la livraison</p>
        </div>
      </section>

      {/* Section Catégories */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Nos 3 univers de produits</h2>
          <Link to="/products" className="section-link">
            Voir tous nos produits →
          </Link>
        </div>
        <div className="categories-grid">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={`/products?categorie=${category.category}`}
              className="category-card"
            >
              <div className="category-image">
                <img src={category.image} alt={category.name} />
              </div>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Section Produits Vedettes */}
      <section className="featured-products-section">
        <div className="section-header">
          <h2>Nos produits vedettes</h2>
          <Link to="/products" className="section-link">
            Voir tous nos produits →
          </Link>
        </div>
        <div className="products-grid">
          {featuredProducts.map((product) => (
            <div 
              key={product.id} 
              className="product-item clickable"
              onClick={() => openPanierModal(product)}
            >
              <div className="product-image">
                <img src={product.imageUrl} alt={product.nom} />
                <button className="wishlist-btn" onClick={(e) => e.stopPropagation()}>♥</button>
                {product.isNew && <span className="new-tag">NOUVEAU</span>}
                <span className={`category-tag ${product.category}`}>
                  {product.category === 'frais' ? 'FRAIS' : 
                   product.category === 'bio' ? 'BIO' : 'Rangement'}
                </span>
                <div className="click-hint">
                  <span>👆 Cliquez pour voir le contenu</span>
                </div>
              </div>
              <div className="product-info">
                <h3>{product.nom}</h3>
                <p>{product.description}</p>
                <div className="product-footer">
                  <span className="current-price">{product.prix} DH</span>
                  <button 
                    className="add-to-cart-btn"
                    onClick={(e) => handleAddToCart(product, e)}
                  >
                    <span className="cart-icon">🛒</span>
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal Contenu du Panier */}
      {selectedPanier && (
        <div className="panier-modal-overlay" onClick={closePanierModal}>
          <div className="panier-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closePanierModal}>✕</button>
            
            <div className="modal-header">
              <img src={selectedPanier.imageUrl} alt={selectedPanier.nom} className="modal-image" />
              <div className="modal-title-section">
                <span className={`modal-category ${selectedPanier.category}`}>
                  {selectedPanier.category === 'frais' ? '🥬 FRAIS' : '🌿 BIO'}
                </span>
                <h2>{selectedPanier.nom}</h2>
                <p className="modal-price">{selectedPanier.prix} DH</p>
              </div>
            </div>

            <div className="modal-content">
              <h3>📦 Contenu du panier</h3>
              <div className="constituants-list">
                {selectedPanier.constituants.map((item, index) => (
                  <div key={index} className="constituant-item">
                    <span className="constituant-icon">{item.icon}</span>
                    <div className="constituant-details">
                      <span className="constituant-nom">{item.nom}</span>
                      <span className="constituant-quantite">{item.quantite}</span>
                    </div>
                    <span className="constituant-check">✓</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <div className="modal-total">
                <span>Total</span>
                <span className="total-price">{selectedPanier.prix} DH</span>
              </div>
              <button 
                className="modal-add-btn"
                onClick={(e) => {
                  handleAddToCart(selectedPanier, e);
                  closePanierModal();
                }}
              >
                🛒 Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section Promotion */}
      <section className="promo-section">
        <div className="promo-content">
          <h2>🌟 Frezona.ma - Votre partenaire fraîcheur</h2>
          <p>
            Découvrez nos 3 univers : Légumes & Fruits Frais, Produits BIO 
            (légumes, fruits, huile d'olive, œufs et produits laitiers) 
            et Rangement Panier en Osier artisanal.
          </p>
          <Link to="/products" className="promo-btn">
            🛒 Découvrir nos produits
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
