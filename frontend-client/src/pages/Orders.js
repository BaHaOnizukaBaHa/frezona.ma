import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Orders.css';

function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCommande, setSelectedCommande] = useState(null);

  const fetchCommandes = useCallback(async () => {
    if (!user?.email) return;
    
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/commandes/user/${user.email}`);
      setCommandes(response.data || []);
    } catch (err) {
      console.error('Erreur chargement commandes:', err);
      setError('Impossible de charger vos commandes');
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCommandes();
  }, [user, navigate, fetchCommandes]);

  const getStatutBadge = (statut) => {
    const statuts = {
      'EN_ATTENTE': { label: 'En attente', class: 'pending', icon: '⏳' },
      'EN_COURS': { label: 'En cours', class: 'processing', icon: '📦' },
      'EXPEDIEE': { label: 'Expédiée', class: 'shipped', icon: '🚚' },
      'LIVREE': { label: 'Livrée', class: 'delivered', icon: '✅' },
      'ANNULEE': { label: 'Annulée', class: 'cancelled', icon: '❌' }
    };
    return statuts[statut] || { label: statut || 'En attente', class: 'default', icon: '📋' };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date non disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="orders-container">
        <div className="orders-loading">
          <div className="loading-spinner"></div>
          <p>Chargement de vos commandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>📦 Mes Commandes</h1>
        <p>Retrouvez l'historique de toutes vos commandes</p>
      </div>

      {error && <div className="orders-error">{error}</div>}

      {commandes.length === 0 ? (
        <div className="orders-empty">
          <div className="empty-icon">🛒</div>
          <h2>Aucune commande</h2>
          <p>Vous n'avez pas encore passé de commande</p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Découvrir nos produits
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {commandes.map((commande) => {
            const statutInfo = getStatutBadge(commande.statut);
            return (
              <div key={commande.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <span className="order-number">Commande #{commande.id}</span>
                    <span className="order-date">{formatDate(commande.date)}</span>
                  </div>
                  <span className={`order-status ${statutInfo.class}`}>
                    {statutInfo.icon} {statutInfo.label}
                  </span>
                </div>

                <div className="order-body">
                  <div className="order-details">
                    <div className="detail-item">
                      <span className="detail-label">📍 Adresse</span>
                      <span className="detail-value">
                        {commande.adresseLivraison || 'Non renseignée'}, {commande.ville || ''}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">📞 Téléphone</span>
                      <span className="detail-value">{commande.telephone || 'Non renseigné'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">👤 Destinataire</span>
                      <span className="detail-value">
                        {commande.prenom || ''} {commande.nom || ''}
                      </span>
                    </div>
                  </div>

                  <div className="order-total">
                    <span className="total-label">Total</span>
                    <span className="total-value">{(commande.total || 0).toFixed(2)} DH</span>
                  </div>
                </div>

                <div className="order-footer">
                  <button 
                    className="btn-details"
                    onClick={() => setSelectedCommande(selectedCommande === commande.id ? null : commande.id)}
                  >
                    {selectedCommande === commande.id ? '▲ Masquer' : '▼ Voir détails'}
                  </button>
                </div>

                {selectedCommande === commande.id && (
                  <div className="order-expanded">
                    <div className="expanded-section">
                      <h4>📧 Email</h4>
                      <p>{commande.email || 'Non renseigné'}</p>
                    </div>
                    <div className="expanded-section">
                      <h4>💵 Paiement</h4>
                      <p>Paiement à la livraison</p>
                    </div>
                    <div className="expanded-timeline">
                      <h4>📋 Suivi</h4>
                      <div className="timeline">
                        <div className={`timeline-item ${commande.statut ? 'active' : ''}`}>
                          <span className="timeline-icon">✅</span>
                          <span>Reçue</span>
                        </div>
                        <div className={`timeline-item ${['EN_COURS', 'EXPEDIEE', 'LIVREE'].includes(commande.statut) ? 'active' : ''}`}>
                          <span className="timeline-icon">📦</span>
                          <span>Préparation</span>
                        </div>
                        <div className={`timeline-item ${['EXPEDIEE', 'LIVREE'].includes(commande.statut) ? 'active' : ''}`}>
                          <span className="timeline-icon">🚚</span>
                          <span>Expédiée</span>
                        </div>
                        <div className={`timeline-item ${commande.statut === 'LIVREE' ? 'active' : ''}`}>
                          <span className="timeline-icon">🏠</span>
                          <span>Livrée</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Orders;
