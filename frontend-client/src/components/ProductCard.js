import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

function ProductCard({ produit }) {
  const { addToCart, getCartItemCount } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      addToCart(produit, 1);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const cartItemCount = getCartItemCount();

  return (
    <div className="product-card">
      <img src={produit.imageUrl || 'https://via.placeholder.com/180x120?text=Produit'} alt={produit.nom} className="product-img" />
      <h3>{produit.nom}</h3>
      <p className="product-desc">{produit.description}</p>
      <div className="product-info">
        <span className="product-price">{produit.prix} DH</span>
        <span className="product-cat">{produit.categorie}</span>
      </div>
      <div className="product-actions">
        <Link to={`/produits/${produit.id}`} className="btn btn-detail">Voir détail</Link>
        <button 
          className={`btn btn-add-cart ${isAdding ? 'adding' : ''} ${showSuccess ? 'success' : ''}`}
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? 'Ajout...' : showSuccess ? '✓ Ajouté !' : 'Ajouter au panier'}
        </button>
      </div>
      {cartItemCount > 0 && (
        <div className="cart-indicator">
          {cartItemCount} article(s) dans le panier
        </div>
      )}
    </div>
  );
}

export default ProductCard; 