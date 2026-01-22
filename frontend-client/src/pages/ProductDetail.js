import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/produits/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('Produit non trouvé');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/checkout');
    }
  };

  const getStockStatus = (stock) => {
    if (stock <= 0) return { text: 'Rupture de stock', class: 'out', icon: '❌' };
    if (stock < 10) return { text: `Plus que ${stock} en stock`, class: 'low', icon: '⚠️' };
    return { text: 'En stock', class: 'available', icon: '✅' };
  };

  if (loading) {
    return (
      <div className="detail-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="detail-page">
        <div className="error-state">
          <span className="error-icon">😕</span>
          <h2>Produit non trouvé</h2>
          <p>Ce produit n'existe pas ou a été supprimé.</p>
          <button onClick={() => navigate('/products')} className="back-btn">
            ← Retour aux produits
          </button>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus(product.stock);
  const totalPrice = (product.prix * quantity).toFixed(2);

  return (
    <div className="detail-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/home">Accueil</Link>
        <span className="separator">/</span>
        <Link to="/products">Produits</Link>
        <span className="separator">/</span>
        <span className="current">{product.nom}</span>
      </div>

      <div className="detail-container">
        {/* Section Image */}
        <div className="image-section">
          <div className="main-image-wrapper">
            {!imageLoaded && <div className="image-skeleton"></div>}
            <img 
              src={product.imageUrl || '/placeholder-product.jpg'} 
              alt={product.nom}
              className={`main-image ${imageLoaded ? 'loaded' : ''}`}
              onLoad={() => setImageLoaded(true)}
            />
            
            {/* Badges sur l'image */}
            <div className="image-badges">
              {product.categorie && (
                <span className={`badge category ${product.categorie.toLowerCase()}`}>
                  {product.categorie === 'BIO' ? '🌿' : '🥬'} {product.categorie}
                </span>
              )}
            </div>
          </div>

          {/* Garanties */}
          <div className="guarantees">
            <div className="guarantee-item">
              <span className="guarantee-icon">🚚</span>
              <span>Livraison rapide</span>
            </div>
            <div className="guarantee-item">
              <span className="guarantee-icon">✅</span>
              <span>Qualité garantie</span>
            </div>
            <div className="guarantee-item">
              <span className="guarantee-icon">💯</span>
              <span>100% Frais</span>
            </div>
          </div>
        </div>

        {/* Section Informations */}
        <div className="info-section">
          {/* Titre et catégorie */}
          <div className="product-header">
            <h1 className="product-title">{product.nom}</h1>
            <div className={`stock-status ${stockStatus.class}`}>
              <span>{stockStatus.icon}</span>
              <span>{stockStatus.text}</span>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <p className="product-description">{product.description}</p>
          )}

          {/* Prix */}
          <div className="price-section">
            <div className="price-main">
              <span className="price-value">{product.prix}</span>
              <span className="price-currency">DH</span>
              {product.unite && (
                <span className="price-unit">/ {product.unite}</span>
              )}
            </div>
            {product.stock > 0 && (
              <div className="stock-quantity">
                📦 {product.stock} {product.unite || 'unités'} disponibles
              </div>
            )}
          </div>

          {/* Sélecteur de quantité */}
          <div className="quantity-section">
            <label>Quantité</label>
            <div className="quantity-selector">
              <button 
                className="qty-btn minus"
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="qty-value">{quantity}</span>
              <button 
                className="qty-btn plus"
                onClick={() => setQuantity(quantity + 1)}
                disabled={product.stock <= 0}
              >
                +
              </button>
            </div>
            <div className="subtotal">
              Total: <strong>{totalPrice} DH</strong>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="action-buttons">
            <button 
              className={`btn-add-cart ${addedToCart ? 'added' : ''}`}
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              {addedToCart ? (
                <>✓ Ajouté au panier !</>
              ) : (
                <>🛒 Ajouter au panier</>
              )}
            </button>
            <button 
              className="btn-buy-now"
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
            >
              ⚡ Acheter maintenant
            </button>
          </div>

          {/* Message de succès */}
          {addedToCart && (
            <div className="success-message">
              <span>✅ {quantity} x {product.nom} ajouté(s) au panier</span>
              <Link to="/cart" className="view-cart-link">Voir le panier →</Link>
            </div>
          )}

          {/* Informations supplémentaires */}
          <div className="extra-info">
            <div className="info-card">
              <div className="info-icon">🏷️</div>
              <div className="info-content">
                <span className="info-label">Catégorie</span>
                <span className="info-value">{product.categorie || 'Non catégorisé'}</span>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">📏</div>
              <div className="info-content">
                <span className="info-label">Unité</span>
                <span className="info-value">{product.unite || 'Unité'}</span>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">📦</div>
              <div className="info-content">
                <span className="info-label">Stock</span>
                <span className="info-value">{product.stock || 0} disponible(s)</span>
              </div>
            </div>
          </div>

          {/* Avantages */}
          <div className="benefits-section">
            <h3>Pourquoi choisir Frezona ?</h3>
            <div className="benefits-grid">
              <div className="benefit">
                <span className="benefit-icon">🌱</span>
                <span>Produits frais et de qualité</span>
              </div>
              <div className="benefit">
                <span className="benefit-icon">🚛</span>
                <span>Livraison à Rabat, Salé & Témara</span>
              </div>
              <div className="benefit">
                <span className="benefit-icon">💵</span>
                <span>Paiement à la livraison</span>
              </div>
              <div className="benefit">
                <span className="benefit-icon">📞</span>
                <span>Support client disponible</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton retour flottant sur mobile */}
      <button className="floating-back" onClick={() => navigate('/products')}>
        ← Produits
      </button>
    </div>
  );
}

export default ProductDetail;
