import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Admin.css';

function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [clientsHistory, setClientsHistory] = useState([]);
  const [paniersComposes, setPaniersComposes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showPanierForm, setShowPanierForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingPanier, setEditingPanier] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    stock: '',
    imageUrl: '',
    categorie: '',
    unite: 'unité'
  });
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const panierFileInputRef = useRef(null);
  
  // État pour le formulaire de panier
  const [panierFormData, setPanierFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    imageUrl: '',
    actif: true,
    produits: []
  });
  const [panierImageFile, setPanierImageFile] = useState(null);
  const [panierImagePreview, setPanierImagePreview] = useState(null);
  const [newProduitItem, setNewProduitItem] = useState({ nomProduit: '', quantiteDescription: '' });

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    fetchProducts();
    fetchCommandes();
    fetchPaniersComposes();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/produits');
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setLoading(false);
    }
  };

  const fetchCommandes = async () => {
    try {
      const response = await api.get('/commandes');
      setCommandes(response.data);
      
      // Calculer l'historique des clients
      calculateClientsHistory(response.data);
    } catch (error) {
      console.error('Erreur commandes:', error);
    }
  };

  // Calculer l'historique des clients à partir des commandes
  const calculateClientsHistory = (commandesData) => {
    const clientsMap = {};
    
    commandesData.forEach(commande => {
      const email = commande.email || commande.utilisateur?.email || 'Inconnu';
      const nom = commande.nom || commande.utilisateur?.nom || '';
      const prenom = commande.prenom || commande.utilisateur?.prenom || '';
      const telephone = commande.telephone || commande.utilisateur?.numeroTelephone || 'Non renseigné';
      const total = commande.total || 0;
      
      if (!clientsMap[email]) {
        clientsMap[email] = {
          email,
          nom: `${prenom} ${nom}`.trim() || 'Client',
          telephone,
          totalDepense: 0,
          nombreCommandes: 0,
          derniereCommande: null
        };
      }
      
      clientsMap[email].totalDepense += total;
      clientsMap[email].nombreCommandes += 1;
      
      // Mettre à jour la dernière commande
      const commandeDate = new Date(commande.date);
      if (!clientsMap[email].derniereCommande || commandeDate > new Date(clientsMap[email].derniereCommande)) {
        clientsMap[email].derniereCommande = commande.date;
      }
    });
    
    // Convertir en tableau et trier par total dépensé
    const clientsArray = Object.values(clientsMap).sort((a, b) => b.totalDepense - a.totalDepense);
    setClientsHistory(clientsArray);
  };

  // Récupérer les paniers composés
  const fetchPaniersComposes = async () => {
    try {
      const response = await api.get('/paniers-composes');
      setPaniersComposes(response.data);
    } catch (error) {
      console.error('Erreur paniers:', error);
    }
  };

  // Gestion du formulaire de panier
  const handlePanierInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPanierFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Gestion de l'image du panier
  const handlePanierImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMessage('❌ Veuillez sélectionner une image');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setMessage('❌ L\'image ne doit pas dépasser 5MB');
        return;
      }
      setPanierImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPanierImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Ajouter un produit au panier
  const handleAddProduitToPanier = () => {
    if (newProduitItem.nomProduit.trim()) {
      setPanierFormData(prev => ({
        ...prev,
        produits: [...prev.produits, { ...newProduitItem }]
      }));
      setNewProduitItem({ nomProduit: '', quantiteDescription: '' });
    }
  };

  // Supprimer un produit du panier
  const handleRemoveProduitFromPanier = (index) => {
    setPanierFormData(prev => ({
      ...prev,
      produits: prev.produits.filter((_, i) => i !== index)
    }));
  };

  // Upload image panier
  const uploadPanierImage = async () => {
    if (!panierImageFile) return null;
    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', panierImageFile);
      const response = await api.post('/upload/image', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploading(false);
      return response.data.imageUrl;
    } catch (error) {
      setUploading(false);
      throw error;
    }
  };

  // Soumettre le formulaire de panier
  const handlePanierSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = panierFormData.imageUrl;
      if (panierImageFile) {
        imageUrl = await uploadPanierImage();
      }

      const panierData = {
        ...panierFormData,
        imageUrl: imageUrl,
        prix: parseFloat(panierFormData.prix)
      };

      if (editingPanier) {
        await api.put(`/paniers-composes/${editingPanier.id}`, panierData);
        setMessage('✅ Panier modifié avec succès !');
      } else {
        await api.post('/paniers-composes', panierData);
        setMessage('✅ Panier créé avec succès !');
      }

      setShowPanierForm(false);
      setEditingPanier(null);
      setPanierFormData({ nom: '', description: '', prix: '', imageUrl: '', actif: true, produits: [] });
      setPanierImageFile(null);
      setPanierImagePreview(null);
      fetchPaniersComposes();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Erreur: ' + (error.response?.data?.message || error.message));
    }
  };

  // Éditer un panier
  const handleEditPanier = (panier) => {
    setEditingPanier(panier);
    setPanierFormData({
      nom: panier.nom,
      description: panier.description || '',
      prix: panier.prix.toString(),
      imageUrl: panier.imageUrl || '',
      actif: panier.actif,
      produits: panier.produits || []
    });
    setPanierImageFile(null);
    setPanierImagePreview(panier.imageUrl || null);
    setShowPanierForm(true);
  };

  // Supprimer un panier
  const handleDeletePanier = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce panier ?')) {
      try {
        await api.delete(`/paniers-composes/${id}`);
        setMessage('✅ Panier supprimé avec succès !');
        fetchPaniersComposes();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('❌ Erreur lors de la suppression');
      }
    }
  };

  // Annuler le formulaire de panier
  const handleCancelPanier = () => {
    setShowPanierForm(false);
    setEditingPanier(null);
    setPanierFormData({ nom: '', description: '', prix: '', imageUrl: '', actif: true, produits: [] });
    setPanierImageFile(null);
    setPanierImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gestion de la sélection d'image
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type
      if (!file.type.startsWith('image/')) {
        setMessage('❌ Veuillez sélectionner une image');
        return;
      }
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('❌ L\'image ne doit pas dépasser 5MB');
        return;
      }
      setImageFile(file);
      // Créer une prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload de l'image
  const uploadImage = async () => {
    if (!imageFile) return null;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', imageFile);

      const response = await api.post('/upload/image', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        return response.data.imageUrl;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      setMessage('❌ Erreur lors de l\'upload de l\'image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.imageUrl;

      // Si une nouvelle image a été sélectionnée, l'uploader
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else if (!formData.imageUrl) {
          // Si l'upload a échoué et qu'il n'y a pas d'URL existante
          setMessage('❌ Erreur lors de l\'upload de l\'image');
          return;
        }
      }

      const productData = {
        ...formData,
        imageUrl: imageUrl,
        prix: parseFloat(formData.prix),
        stock: parseInt(formData.stock)
      };

      if (editingProduct) {
        await api.put(`/produits/${editingProduct.id}`, productData);
        setMessage('✅ Produit modifié avec succès !');
      } else {
        await api.post('/produits', productData);
        setMessage('✅ Produit ajouté avec succès !');
      }

      setShowForm(false);
      setEditingProduct(null);
      setFormData({ nom: '', description: '', prix: '', stock: '', imageUrl: '', categorie: '', unite: 'unité' });
      setImageFile(null);
      setImagePreview(null);
      fetchProducts();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Erreur: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      nom: product.nom,
      description: product.description || '',
      prix: product.prix.toString(),
      stock: product.stock.toString(),
      imageUrl: product.imageUrl || '',
      categorie: product.categorie || '',
      unite: product.unite || 'unité'
    });
    setImageFile(null);
    setImagePreview(product.imageUrl || null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await api.delete(`/produits/${id}`);
        setMessage('✅ Produit supprimé avec succès !');
        fetchProducts();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('❌ Erreur lors de la suppression');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({ nom: '', description: '', prix: '', stock: '', imageUrl: '', categorie: '', unite: 'unité' });
    setImageFile(null);
    setImagePreview(null);
  };

  // Supprimer l'image sélectionnée
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Mise à jour du statut de commande
  const handleUpdateStatus = async (commandeId, newStatus) => {
    try {
      await api.put(`/commandes/${commandeId}/statut`, { statut: newStatus });
      setMessage(`✅ Commande #${commandeId} mise à jour : ${newStatus}`);
      fetchCommandes();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      setMessage('❌ Erreur lors de la mise à jour');
    }
  };

  // Toggle pour voir les détails d'une commande
  const [expandedCommande, setExpandedCommande] = useState(null);
  
  const toggleCommandeDetails = (commandeId) => {
    setExpandedCommande(expandedCommande === commandeId ? null : commandeId);
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Couleur du statut
  const getStatusColor = (statut) => {
    const s = statut?.toUpperCase();
    switch (s) {
      case 'EN_ATTENTE': return '#ffc107';
      case 'CONFIRMEE': return '#17a2b8';
      case 'EN_PREPARATION': return '#6f42c1';
      case 'EN_LIVRAISON': return '#fd7e14';
      case 'LIVREE': return '#28a745';
      case 'ANNULEE': return '#dc3545';
      default: return '#6c757d';
    }
  };

  // Texte du statut
  const getStatusText = (statut) => {
    const s = statut?.toUpperCase();
    switch (s) {
      case 'EN_ATTENTE': return '📋 En attente';
      case 'CONFIRMEE': return '✅ Confirmée';
      case 'EN_PREPARATION': return '👨‍🍳 En préparation';
      case 'EN_LIVRAISON': return '🚚 En livraison';
      case 'LIVREE': return '✅ Livrée';
      case 'ANNULEE': return '❌ Annulée';
      default: return statut || 'En attente';
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="admin-container">
        <div className="access-denied">
          <h2>⛔ Accès refusé</h2>
          <p>Vous devez être administrateur pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="admin-container"><div className="loading">Chargement...</div></div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🔧 Panel Administrateur</h1>
        <p>Bienvenue, {user.prenom} {user.nom}</p>
      </div>

      {message && <div className={`admin-message ${message.includes('❌') ? 'error' : 'success'}`}>{message}</div>}

      {/* Onglets */}
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          📦 Produits ({products.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'paniers' ? 'active' : ''}`}
          onClick={() => setActiveTab('paniers')}
        >
          🧺 Paniers ({paniersComposes.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'commandes' ? 'active' : ''}`}
          onClick={() => setActiveTab('commandes')}
        >
          🛒 Commandes ({commandes.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'clients' ? 'active' : ''}`}
          onClick={() => setActiveTab('clients')}
        >
          👥 Clients ({clientsHistory.length})
        </button>
      </div>

      {/* Onglet Produits */}
      {activeTab === 'products' && (
        <>
          <div className="admin-actions">
            <button 
              className="btn-add-product"
              onClick={() => setShowForm(true)}
            >
              ➕ Ajouter un produit
            </button>
          </div>

          {showForm && (
            <div className="product-form-overlay">
              <div className="product-form">
                <h2>{editingProduct ? '✏️ Modifier le produit' : '➕ Nouveau produit'}</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Nom du produit *</label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      required
                      placeholder="Ex: Tomates Bio"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Description du produit..."
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Prix (DH) *</label>
                      <input
                        type="number"
                        name="prix"
                        value={formData.prix}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        required
                        placeholder="0.00"
                      />
                    </div>
                    <div className="form-group">
                      <label>Stock *</label>
                      <div className="stock-with-unit">
                        <input
                          type="number"
                          name="stock"
                          value={formData.stock}
                          onChange={handleInputChange}
                          min="0"
                          required
                          placeholder="0"
                        />
                        <select
                          name="unite"
                          value={formData.unite}
                          onChange={handleInputChange}
                          className="unite-select"
                        >
                          <option value="kg">kg</option>
                          <option value="g">g</option>
                          <option value="L">L</option>
                          <option value="ml">ml</option>
                          <option value="unité">unité</option>
                          <option value="pièce">pièce</option>
                          <option value="barquette">barquette</option>
                          <option value="bouteille">bouteille</option>
                          <option value="sachet">sachet</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Section Upload Image */}
                  <div className="form-group image-upload-section">
                    <label>Image du produit</label>
                    
                    {/* Prévisualisation */}
                    {imagePreview && (
                      <div className="image-preview-container">
                        <img src={imagePreview} alt="Prévisualisation" className="image-preview" />
                        <button 
                          type="button" 
                          className="btn-remove-image"
                          onClick={handleRemoveImage}
                        >
                          ✕ Supprimer
                        </button>
                      </div>
                    )}
                    
                    {/* Input file */}
                    <div className="image-input-container">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        ref={fileInputRef}
                        className="file-input"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="file-input-label">
                        📁 {imageFile ? imageFile.name : 'Choisir une image depuis votre PC'}
                      </label>
                    </div>
                    
                    <p className="image-help">
                      Formats acceptés: JPG, PNG, GIF (max 5MB)
                    </p>
                  </div>

                  <div className="form-group">
                    <label>Catégorie</label>
                    <select
                      name="categorie"
                      value={formData.categorie}
                      onChange={handleInputChange}
                    >
                      <option value="">Sélectionner...</option>
                      <option value="Frais">Légumes & Fruits Frais</option>
                      <option value="BIO">Produits BIO</option>
                      <option value="Osier">🧺 Paniers en Osier</option>
                    </select>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-save" disabled={uploading}>
                      {uploading ? '⏳ Upload en cours...' : (editingProduct ? 'Modifier' : 'Ajouter')}
                    </button>
                    <button type="button" className="btn-cancel" onClick={handleCancel}>
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="products-table">
            <h2>📦 Liste des produits ({products.length})</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Nom</th>
                  <th>Prix</th>
                  <th>Stock</th>
                  <th>Catégorie</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.nom}
                          className="product-thumbnail"
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                      ) : null}
                      <div 
                        className="product-placeholder"
                        style={{ display: product.imageUrl ? 'none' : 'flex' }}
                      >
                        📦
                      </div>
                    </td>
                    <td>{product.nom}</td>
                    <td className="price">{product.prix} DH</td>
                    <td className={product.stock < 5 ? 'low-stock' : ''}>
                      {product.stock} {product.unite || 'unité'}
                    </td>
                    <td>{product.categorie}</td>
                    <td className="actions">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEdit(product)}
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(product.id)}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Onglet Paniers Composés */}
      {activeTab === 'paniers' && (
        <div className="paniers-section">
          <div className="admin-actions">
            <button 
              className="btn-add-product"
              onClick={() => setShowPanierForm(true)}
            >
              🧺 Créer un panier composé
            </button>
          </div>

          {/* Formulaire de création/édition de panier */}
          {showPanierForm && (
            <div className="product-form-overlay">
              <div className="product-form panier-form">
                <h2>{editingPanier ? '✏️ Modifier le panier' : '🧺 Nouveau panier composé'}</h2>
                <form onSubmit={handlePanierSubmit}>
                  <div className="form-group">
                    <label>Nom du panier *</label>
                    <input
                      type="text"
                      name="nom"
                      value={panierFormData.nom}
                      onChange={handlePanierInputChange}
                      required
                      placeholder="Ex: Panier Essentiel, Panier Royal..."
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={panierFormData.description}
                      onChange={handlePanierInputChange}
                      rows="3"
                      placeholder="Description du panier..."
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Prix (DH) *</label>
                      <input
                        type="number"
                        name="prix"
                        value={panierFormData.prix}
                        onChange={handlePanierInputChange}
                        step="0.01"
                        min="0"
                        required
                        placeholder="0.00"
                      />
                    </div>
                    <div className="form-group checkbox-group">
                      <label>
                        <input
                          type="checkbox"
                          name="actif"
                          checked={panierFormData.actif}
                          onChange={handlePanierInputChange}
                        />
                        Panier actif (visible sur le site)
                      </label>
                    </div>
                  </div>

                  {/* Image du panier */}
                  <div className="form-group image-upload-section">
                    <label>Image du panier</label>
                    {panierImagePreview && (
                      <div className="image-preview-container">
                        <img src={panierImagePreview} alt="Prévisualisation" className="image-preview" />
                        <button 
                          type="button" 
                          className="btn-remove-image"
                          onClick={() => { setPanierImageFile(null); setPanierImagePreview(null); }}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    <div className="image-input-container">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePanierImageSelect}
                        ref={panierFileInputRef}
                        className="file-input"
                        id="panier-image-upload"
                      />
                      <label htmlFor="panier-image-upload" className="file-input-label">
                        📁 {panierImageFile ? panierImageFile.name : 'Choisir une image'}
                      </label>
                    </div>
                  </div>

                  {/* Constituants du panier */}
                  <div className="form-group panier-produits-section">
                    <label>🥬 Constituants du panier</label>
                    
                    {/* Liste des produits ajoutés */}
                    {panierFormData.produits.length > 0 && (
                      <div className="panier-produits-list">
                        {panierFormData.produits.map((produit, index) => (
                          <div key={index} className="panier-produit-item">
                            <span className="produit-nom">{produit.nomProduit}</span>
                            <span className="produit-qty">{produit.quantiteDescription}</span>
                            <button 
                              type="button"
                              onClick={() => handleRemoveProduitFromPanier(index)}
                              className="btn-remove-produit"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Ajouter un produit */}
                    <div className="add-produit-form">
                      <input
                        type="text"
                        placeholder="Nom du produit (ex: Tomates)"
                        value={newProduitItem.nomProduit}
                        onChange={(e) => setNewProduitItem(prev => ({ ...prev, nomProduit: e.target.value }))}
                      />
                      <input
                        type="text"
                        placeholder="Quantité (ex: 500g, 1L)"
                        value={newProduitItem.quantiteDescription}
                        onChange={(e) => setNewProduitItem(prev => ({ ...prev, quantiteDescription: e.target.value }))}
                      />
                      <button 
                        type="button" 
                        onClick={handleAddProduitToPanier}
                        className="btn-add-produit"
                      >
                        ➕
                      </button>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-save" disabled={uploading}>
                      {uploading ? '⏳ Upload...' : (editingPanier ? 'Modifier' : 'Créer le panier')}
                    </button>
                    <button type="button" className="btn-cancel" onClick={handleCancelPanier}>
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Liste des paniers */}
          <div className="paniers-grid">
            {paniersComposes.length === 0 ? (
              <div className="no-paniers">
                <p>🧺 Aucun panier composé créé</p>
                <p className="hint">Créez des paniers comme "Panier Essentiel" ou "Panier Royal"</p>
              </div>
            ) : (
              paniersComposes.map(panier => (
                <div key={panier.id} className={`panier-card ${!panier.actif ? 'inactive' : ''}`}>
                  <div className="panier-image">
                    {panier.imageUrl ? (
                      <img src={panier.imageUrl} alt={panier.nom} />
                    ) : (
                      <div className="panier-placeholder">🧺</div>
                    )}
                    {!panier.actif && <span className="inactive-badge">Inactif</span>}
                  </div>
                  <div className="panier-content">
                    <h3>{panier.nom}</h3>
                    <p className="panier-description">{panier.description}</p>
                    <div className="panier-prix">{panier.prix} DH</div>
                    
                    {panier.produits && panier.produits.length > 0 && (
                      <div className="panier-constituants">
                        <strong>Contient :</strong>
                        <ul>
                          {panier.produits.map((p, i) => (
                            <li key={i}>{p.nomProduit} {p.quantiteDescription && `(${p.quantiteDescription})`}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="panier-actions">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEditPanier(panier)}
                      >
                        ✏️ Modifier
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeletePanier(panier.id)}
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Onglet Commandes */}
      {activeTab === 'commandes' && (
        <div className="commandes-section">
          <h2>🛒 Commandes reçues ({commandes.length})</h2>
          
          {commandes.length === 0 ? (
            <div className="no-commandes">
              <p>📭 Aucune commande pour le moment</p>
              <p className="hint">Les commandes des clients apparaîtront ici</p>
            </div>
          ) : (
            <div className="commandes-list">
              {commandes.map(commande => (
                <div key={commande.id} className="commande-card">
                  <div className="commande-header">
                    <div className="commande-id">
                      <span className="label">Commande</span>
                      <span className="value">#{commande.id}</span>
                    </div>
                    <div 
                      className="commande-status"
                      style={{ backgroundColor: getStatusColor(commande.statut) }}
                    >
                      {getStatusText(commande.statut)}
                    </div>
                  </div>
                  
                  <div className="commande-body">
                    <div className="commande-info">
                      <div className="info-row">
                        <span className="icon">👤</span>
                        <span><strong>{commande.prenom || ''} {commande.nom || ''}</strong></span>
                      </div>
                      <div className="info-row">
                        <span className="icon">📧</span>
                        <span>{commande.email || 'N/A'}</span>
                      </div>
                      <div className="info-row">
                        <span className="icon">📞</span>
                        <span>{commande.telephone || 'N/A'}</span>
                      </div>
                      <div className="info-row">
                        <span className="icon">📍</span>
                        <span>{commande.adresseLivraison || 'N/A'}, {commande.ville || 'N/A'}</span>
                      </div>
                      <div className="info-row">
                        <span className="icon">📅</span>
                        <span>{formatDate(commande.date)}</span>
                      </div>
                      {commande.notes && (
                        <div className="info-row notes">
                          <span className="icon">📝</span>
                          <span>{commande.notes}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="commande-total">
                      <div className="total-details">
                        {commande.fraisLivraison > 0 && (
                          <div className="frais">Livraison: {commande.fraisLivraison?.toFixed(2)} DH</div>
                        )}
                        <span className="label">Total</span>
                        <span className="value">{commande.total?.toFixed(2) || '0.00'} DH</span>
                      </div>
                    </div>
                  </div>

                  {/* Bouton pour voir les détails */}
                  <button 
                    className="btn-toggle-details"
                    onClick={() => toggleCommandeDetails(commande.id)}
                  >
                    {expandedCommande === commande.id ? '🔼 Masquer les produits' : '🔽 Voir les produits'}
                  </button>

                  {/* Détails des produits commandés */}
                  {expandedCommande === commande.id && (
                    <div className="commande-items">
                      {commande.items && commande.items.length > 0 ? (
                        <>
                          <h4>📦 Produits commandés ({commande.items.length})</h4>
                          <table className="items-table">
                            <thead>
                              <tr>
                                <th>Produit</th>
                                <th>Prix unitaire</th>
                                <th>Quantité</th>
                                <th>Sous-total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {commande.items.map((item, index) => (
                                <tr key={index}>
                                  <td className="item-name">
                                    {item.imageUrl && (
                                      <img src={item.imageUrl} alt={item.nomProduit} className="item-img" />
                                    )}
                                    {item.nomProduit}
                                  </td>
                                  <td>{item.prixUnitaire?.toFixed(2)} DH</td>
                                  <td className="qty">x{item.quantite}</td>
                                  <td className="subtotal">{(item.prixUnitaire * item.quantite).toFixed(2)} DH</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </>
                      ) : (
                        <div className="no-items-message">
                          <p>⚠️ Détails des produits non disponibles pour cette commande</p>
                          <p className="hint">Les anciennes commandes n'ont pas de détails enregistrés</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="commande-actions">
                    <label>Changer le statut:</label>
                    <select 
                      value={commande.statut || 'EN_ATTENTE'}
                      onChange={(e) => handleUpdateStatus(commande.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="EN_ATTENTE">📋 En attente</option>
                      <option value="CONFIRMEE">✅ Confirmée</option>
                      <option value="EN_PREPARATION">👨‍🍳 En préparation</option>
                      <option value="EN_LIVRAISON">🚚 En livraison</option>
                      <option value="LIVREE">✅ Livrée</option>
                      <option value="ANNULEE">❌ Annulée</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Onglet Historique Clients */}
      {activeTab === 'clients' && (
        <div className="clients-section">
          <h2>👥 Historique des Clients ({clientsHistory.length})</h2>
          
          {clientsHistory.length === 0 ? (
            <div className="no-clients">
              <p>📭 Aucun client n'a encore passé de commande</p>
            </div>
          ) : (
            <>
              {/* Statistiques globales */}
              <div className="clients-stats">
                <div className="stat-card">
                  <span className="stat-icon">👥</span>
                  <div className="stat-info">
                    <span className="stat-value">{clientsHistory.length}</span>
                    <span className="stat-label">Clients</span>
                  </div>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">🛒</span>
                  <div className="stat-info">
                    <span className="stat-value">{commandes.length}</span>
                    <span className="stat-label">Commandes</span>
                  </div>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">💰</span>
                  <div className="stat-info">
                    <span className="stat-value">
                      {clientsHistory.reduce((sum, c) => sum + c.totalDepense, 0).toFixed(2)} DH
                    </span>
                    <span className="stat-label">Total des ventes</span>
                  </div>
                </div>
              </div>

              {/* Table des clients */}
              <div className="clients-table-container">
                <table className="clients-table">
                  <thead>
                    <tr>
                      <th>👤 Client</th>
                      <th>📧 Email</th>
                      <th>📞 Téléphone</th>
                      <th>🛒 Commandes</th>
                      <th>💰 Total dépensé</th>
                      <th>📅 Dernière commande</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientsHistory.map((client, index) => (
                      <tr key={client.email} className={index < 3 ? 'top-client' : ''}>
                        <td>
                          <div className="client-name">
                            {index < 3 && <span className="top-badge">🏆 Top {index + 1}</span>}
                            {client.nom}
                          </div>
                        </td>
                        <td>{client.email}</td>
                        <td>
                          <a href={`tel:${client.telephone}`} className="phone-link">
                            📱 {client.telephone}
                          </a>
                        </td>
                        <td>
                          <span className="commandes-count">{client.nombreCommandes}</span>
                        </td>
                        <td>
                          <span className="total-depense">{client.totalDepense.toFixed(2)} DH</span>
                        </td>
                        <td>
                          {client.derniereCommande 
                            ? new Date(client.derniereCommande).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })
                            : 'N/A'
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Admin;
