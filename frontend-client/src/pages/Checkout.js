import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Checkout.css';

function Checkout() {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('livraison'); // 'livraison' ou 'carte'
  
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    adresse: '',
    ville: 'Rabat',
    telephone: '',
    email: '',
    notes: '',
    acceptTerms: false
  });

  // Pré-remplir avec les données utilisateur si connecté
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        prenom: user.prenom || '',
        nom: user.nom || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const total = getCartTotal();
  const shippingCost = 20.00;
  const finalTotal = total + shippingCost;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.prenom.trim()) {
      setError('Le prénom est obligatoire');
      return false;
    }
    if (!formData.nom.trim()) {
      setError('Le nom est obligatoire');
      return false;
    }
    if (!formData.adresse.trim()) {
      setError('L\'adresse est obligatoire');
      return false;
    }
    if (!formData.telephone.trim()) {
      setError('Le téléphone est obligatoire');
      return false;
    }
    if (!formData.email.trim()) {
      setError('L\'email est obligatoire');
      return false;
    }
    if (!formData.acceptTerms) {
      setError('Veuillez accepter les conditions générales');
      return false;
    }
    return true;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (cart.length === 0) {
      setError('Votre panier est vide');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Préparer les données de la commande
      const commandeData = {
        email: formData.email,
        prenom: formData.prenom,
        nom: formData.nom,
        telephone: formData.telephone,
        adresse: formData.adresse,
        ville: formData.ville,
        notes: formData.notes,
        total: finalTotal,
        fraisLivraison: shippingCost,
        modePaiement: paymentMethod,
        items: cart.map(item => ({
          produitId: item.id,
          nomProduit: item.nom,
          prixUnitaire: item.prix,
          quantite: item.quantite,
          imageUrl: item.imageUrl
        }))
      };

      // Si paiement par carte, rediriger vers Stripe (à implémenter)
      if (paymentMethod === 'carte') {
        // Pour l'instant, afficher un message
        setError('Le paiement par carte sera bientôt disponible. Veuillez choisir le paiement à la livraison.');
        setLoading(false);
        return;
      }

      // Envoyer la commande au backend
      const response = await api.post('/commandes', commandeData);
      
      if (response.data.success) {
        // Vider le panier après commande réussie
        clearCart();
        setSuccess('🎉 Commande validée avec succès ! Numéro: #' + response.data.commandeId);
        
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setError(response.data.message || 'Erreur lors de la commande');
      }
    } catch (err) {
      console.error('Erreur commande:', err);
      setError(err.response?.data?.message || 'Erreur lors de la validation de la commande. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !success) {
    return (
      <div className="checkout-container">
        <div className="checkout-empty">
          <h2>🛒 Votre panier est vide</h2>
          <p>Ajoutez des produits avant de passer commande</p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Voir nos produits
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="checkout-container">
        <div className="checkout-success">
          <div className="success-icon">✅</div>
          <h2>Commande confirmée !</h2>
          <p>{success}</p>
          <p className="success-info">
            {paymentMethod === 'livraison' 
              ? 'Vous recevrez un appel pour confirmer la livraison. Paiement en espèces à la réception.'
              : 'Votre paiement a été traité avec succès.'}
          </p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <button onClick={() => navigate('/cart')} className="back-btn">←</button>
        <h1>Finaliser la commande</h1>
      </div>

      {error && <div className="checkout-error">{error}</div>}

      <div className="checkout-content">
        {/* Formulaire de livraison */}
        <div className="checkout-form-section">
          <form onSubmit={handleSubmitOrder} className="checkout-form">
            <h2>📍 Informations de livraison</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Prénom *</label>
                <input 
                  type="text" 
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  placeholder="Votre prénom"
                  required
                />
              </div>
              <div className="form-group">
                <label>Nom *</label>
                <input 
                  type="text" 
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  placeholder="Votre nom"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Adresse de livraison *</label>
              <input 
                type="text" 
                name="adresse"
                value={formData.adresse}
                onChange={handleInputChange}
                placeholder="Numéro, rue, quartier..."
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Ville *</label>
                <select 
                  name="ville"
                  value={formData.ville}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Rabat">Rabat</option>
                  <option value="Salé">Salé</option>
                  <option value="Témara">Témara</option>
                </select>
              </div>
              <div className="form-group">
                <label>Téléphone *</label>
                <input 
                  type="tel" 
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  placeholder="06 XX XX XX XX"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="votre@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Notes de livraison (optionnel)</label>
              <textarea 
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Instructions spéciales pour la livraison..."
                rows="3"
              />
            </div>

            {/* Section Mode de Paiement */}
            <div className="payment-method-section">
              <h2>💳 Mode de paiement</h2>
              
              <div className="payment-options">
                <label 
                  className={`payment-option ${paymentMethod === 'livraison' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('livraison')}
                >
                  <input 
                    type="radio" 
                    name="paymentMethod"
                    value="livraison"
                    checked={paymentMethod === 'livraison'}
                    onChange={() => setPaymentMethod('livraison')}
                  />
                  <div className="payment-option-content">
                    <div className="payment-icon">💵</div>
                    <div className="payment-details">
                      <span className="payment-title">Paiement à la livraison</span>
                      <span className="payment-desc">Payez en espèces à la réception de votre commande</span>
                    </div>
                    <div className="payment-check">✓</div>
                  </div>
                </label>

                <label 
                  className={`payment-option ${paymentMethod === 'carte' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('carte')}
                >
                  <input 
                    type="radio" 
                    name="paymentMethod"
                    value="carte"
                    checked={paymentMethod === 'carte'}
                    onChange={() => setPaymentMethod('carte')}
                  />
                  <div className="payment-option-content">
                    <div className="payment-icon">💳</div>
                    <div className="payment-details">
                      <span className="payment-title">Paiement par carte</span>
                      <span className="payment-desc">Visa, Mastercard - Paiement sécurisé</span>
                      <span className="payment-coming-soon">Bientôt disponible</span>
                    </div>
                    <div className="payment-check">✓</div>
                  </div>
                  <div className="card-logos">
                    <span className="card-logo visa">VISA</span>
                    <span className="card-logo mastercard">MC</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="terms-section">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                />
                <span>J'accepte les <a href="/terms" target="_blank">conditions générales</a> et la <a href="/privacy" target="_blank">politique de confidentialité</a> *</span>
              </label>
            </div>

            <button 
              type="submit" 
              className="submit-order-btn"
              disabled={loading}
            >
              {loading ? (
                <>⏳ Traitement en cours...</>
              ) : (
                <>
                  {paymentMethod === 'livraison' ? '✅ Confirmer ma commande' : '💳 Payer maintenant'} - {finalTotal.toFixed(2)} DH
                </>
              )}
            </button>
          </form>
        </div>

        {/* Résumé de la commande */}
        <div className="order-summary-section">
          <div className="order-summary">
            <h3>🛒 Récapitulatif</h3>
            
            <div className="order-items">
              {cart.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-image">
                    <img src={item.imageUrl || '/placeholder.jpg'} alt={item.nom} />
                    <span className="item-qty">{item.quantite}</span>
                  </div>
                  <div className="item-details">
                    <span className="item-name">{item.nom}</span>
                    <span className="item-price">{item.prix.toFixed(2)} DH</span>
                  </div>
                  <span className="item-subtotal">{(item.prix * item.quantite).toFixed(2)} DH</span>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="total-line">
                <span>Sous-total</span>
                <span>{total.toFixed(2)} DH</span>
              </div>
              <div className="total-line">
                <span>🚚 Livraison</span>
                <span>{shippingCost.toFixed(2)} DH</span>
              </div>
              <div className="total-line final">
                <span>Total à payer</span>
                <span>{finalTotal.toFixed(2)} DH</span>
              </div>
            </div>

            <div className="payment-info">
              <div className={`payment-badge ${paymentMethod}`}>
                <span>{paymentMethod === 'livraison' ? '💵' : '💳'}</span>
                <div>
                  <strong>
                    {paymentMethod === 'livraison' ? 'Paiement à la livraison' : 'Paiement par carte'}
                  </strong>
                  <p>
                    {paymentMethod === 'livraison' 
                      ? 'Payez en espèces à la réception' 
                      : 'Paiement sécurisé par carte bancaire'}
                  </p>
                </div>
              </div>
            </div>

            <div className="delivery-info">
              <div className="info-item">
                <span>📍</span>
                <span>Livraison à {formData.ville || 'Rabat'}</span>
              </div>
              <div className="info-item">
                <span>⏰</span>
                <span>Livraison rapide</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
