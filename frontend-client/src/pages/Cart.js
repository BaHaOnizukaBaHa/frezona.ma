import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  const total = getCartTotal();
  const shippingCost = 20.00; // Frais de livraison fixes
  const discount = appliedPromo ? (total * appliedPromo.discount / 100) : 0;
  const finalTotal = total - discount + shippingCost;

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handlePromoCode = () => {
    setPromoError('');
    if (promoCode.toLowerCase() === 'bio10') {
      setAppliedPromo({ code: 'BIO10', discount: 10 });
      setPromoCode('');
    } else if (promoCode.toLowerCase() === 'frais15') {
      setAppliedPromo({ code: 'FRAIS15', discount: 15 });
      setPromoCode('');
    } else if (promoCode.toLowerCase() === 'welcome20') {
      setAppliedPromo({ code: 'WELCOME20', discount: 20 });
      setPromoCode('');
    } else {
      setPromoError('Code promo invalide ou expiré');
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty-state">
          <div className="empty-animation">
            <div className="empty-cart-icon">🛒</div>
            <div className="empty-sparkles">✨</div>
          </div>
          <h2>Votre panier est vide</h2>
          <p>Explorez nos produits frais et BIO pour remplir votre panier !</p>
          <button onClick={() => navigate('/products')} className="btn-explore">
            <span>🥬</span> Découvrir nos produits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* Header */}
      <div className="cart-page-header">
        <div className="header-left">
          <button onClick={() => navigate(-1)} className="back-button">
            <span>←</span>
          </button>
          <div className="header-title">
            <h1>Mon Panier</h1>
            <span className="items-count">{cart.length} article{cart.length > 1 ? 's' : ''}</span>
          </div>
        </div>
        <button onClick={clearCart} className="clear-cart-btn">
          🗑️ Vider le panier
        </button>
      </div>

      <div className="cart-layout">
        {/* Liste des produits */}
        <div className="cart-items-container">
          <div className="cart-items-list">
            {cart.map((item, index) => (
              <div 
                key={item.id} 
                className="cart-item-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="item-image-wrapper">
                  <img 
                    src={item.imageUrl || '/placeholder.jpg'} 
                    alt={item.nom}
                    onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                  />
                  {item.category && (
                    <span className={`item-badge ${item.category}`}>
                      {item.category === 'bio' ? '🌿 BIO' : '🥬 Frais'}
                    </span>
                  )}
                </div>
                
                <div className="item-content">
                  <div className="item-header">
                    <h3 className="item-name">{item.nom}</h3>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="remove-item-btn"
                      title="Supprimer"
                    >
                      <span>✕</span>
                    </button>
                  </div>
                  
                  <p className="item-unit-price">{item.prix.toFixed(2)} DH / {item.unite || 'unité'}</p>
                  
                  <div className="item-footer">
                    <div className="quantity-selector">
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantite - 1)}
                        className="qty-button minus"
                        disabled={item.quantite <= 1}
                      >
                        −
                      </button>
                      <span className="qty-value">{item.quantite}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantite + 1)}
                        className="qty-button plus"
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="item-total-price">
                      <span className="price-value">{(item.prix * item.quantite).toFixed(2)} DH</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Code Promo */}
          <div className="promo-code-card">
            <div className="promo-header">
              <span className="promo-icon">🎟️</span>
              <span>Code promo</span>
            </div>
            
            {appliedPromo ? (
              <div className="promo-applied">
                <div className="promo-success">
                  <span className="success-icon">✅</span>
                  <div className="promo-details">
                    <span className="promo-code-text">{appliedPromo.code}</span>
                    <span className="promo-discount">-{appliedPromo.discount}% de réduction</span>
                  </div>
                </div>
                <button onClick={removePromo} className="remove-promo">
                  Supprimer
                </button>
              </div>
            ) : (
              <div className="promo-input-wrapper">
                <input 
                  type="text" 
                  placeholder="Entrez votre code promo" 
                  value={promoCode}
                  onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoError(''); }}
                  className="promo-input-field"
                  onKeyPress={(e) => e.key === 'Enter' && handlePromoCode()}
                />
                <button 
                  onClick={handlePromoCode} 
                  className="apply-promo"
                  disabled={!promoCode.trim()}
                >
                  Appliquer
                </button>
              </div>
            )}
            {promoError && <p className="promo-error">{promoError}</p>}
            
            <div className="promo-hints">
              <p>💡 Essayez : <code>BIO10</code>, <code>FRAIS15</code> ou <code>WELCOME20</code></p>
            </div>
          </div>
        </div>

        {/* Résumé */}
        <div className="cart-summary-container">
          <div className="cart-summary-card">
            <h3 className="summary-title">
              <span>📋</span> Récapitulatif
            </h3>
            
            <div className="summary-lines">
              <div className="summary-line">
                <span>Sous-total ({cart.length} articles)</span>
                <span className="line-value">{total.toFixed(2)} DH</span>
              </div>
              
              {appliedPromo && (
                <div className="summary-line discount">
                  <span>🎁 Réduction ({appliedPromo.code})</span>
                  <span className="line-value">-{discount.toFixed(2)} DH</span>
                </div>
              )}
              
              <div className="summary-line">
                <span>🚚 Livraison</span>
                <span className="line-value">{shippingCost.toFixed(2)} DH</span>
              </div>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-total-line">
              <span>Total</span>
              <div className="total-value">
                {appliedPromo && (
                  <span className="original-total">{(total + shippingCost).toFixed(2)} DH</span>
                )}
                <span className="final-total">{finalTotal.toFixed(2)} DH</span>
              </div>
            </div>

            <button onClick={handleCheckout} className="checkout-button">
              <span className="btn-icon">✅</span>
              <span>Passer la commande</span>
              <span className="btn-arrow">→</span>
            </button>
            
            <button onClick={() => navigate('/products')} className="continue-shopping">
              ← Continuer mes achats
            </button>

            {/* Avantages */}
            <div className="cart-benefits">
              <div className="benefit-item">
                <span>🔒</span>
                <span>Paiement sécurisé</span>
              </div>
              <div className="benefit-item">
                <span>🚚</span>
                <span>Livraison 24-48h</span>
              </div>
              <div className="benefit-item">
                <span>🌿</span>
                <span>Produits frais garantis</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
