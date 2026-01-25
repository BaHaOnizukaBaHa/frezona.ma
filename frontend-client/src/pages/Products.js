import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import './Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('categorie') || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [addedToCart, setAddedToCart] = useState(null);
  const { addToCart } = useCart();

  const categories = [
    { id: 'all', name: 'Tous', icon: '🛒', filter: 'all' },
    { id: 'frais', name: 'Frais', icon: '🥬', filter: 'frais' },
    { id: 'bio', name: 'BIO', icon: '🌿', filter: 'bio' },
    { id: 'osier', name: 'Osier', icon: '🧺', filter: 'osier' }
  ];

  // Scroll vers le haut au chargement de la page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🔄 Chargement des produits...');
        const response = await api.get('/produits');
        console.log('✅ Produits chargés:', response.data);
        setProducts(response.data || []);
        setLoading(false);
      } catch (err) {
        console.error('❌ Erreur chargement produits:', err);
        console.error('❌ Détails:', err.response?.data || err.message);
        const errorMessage = err.response?.data?.message || err.message || 'Erreur lors du chargement des produits';
        setError(`Erreur: ${errorMessage}`);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const categoryFromUrl = searchParams.get('categorie');
    if (categoryFromUrl) {
      setActiveCategory(categoryFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    let filtered = products;

    // Filtre par catégorie
    if (activeCategory !== 'all') {
      filtered = filtered.filter(product => {
        const cat = product.categorie?.toLowerCase() || '';
        if (activeCategory === 'frais') {
          return cat.includes('frais') || cat.includes('légumes') || cat.includes('fruits');
        } else if (activeCategory === 'bio') {
          return cat.includes('bio');
        } else if (activeCategory === 'osier') {
          return cat.includes('rangement') || cat.includes('osier');
        }
        return cat.includes(activeCategory);
      });
    }

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [activeCategory, products, searchTerm]);

  const handleCategoryChange = (categoryFilter) => {
    setActiveCategory(categoryFilter);
    if (categoryFilter === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ categorie: categoryFilter });
    }
    // Scroll vers le haut lors du changement de catégorie
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedToCart(product.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  const getStockStatus = (stock) => {
    if (stock <= 0) return { text: 'Rupture', class: 'out-of-stock' };
    if (stock < 10) return { text: 'Stock limité', class: 'low-stock' };
    return { text: 'En stock', class: 'in-stock' };
  };

  if (loading) {
    return (
      <div className="products-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des produits...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page">
        <div className="error-container">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      {/* Hero Section */}
      <div className="products-hero">
        <div className="hero-content">
          <h1>🌿 Nos Produits</h1>
          <p>Découvrez notre sélection de produits frais et BIO</p>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">{products.length}</span>
            <span className="stat-label">Produits</span>
          </div>
          <div className="stat">
            <span className="stat-number">100%</span>
            <span className="stat-label">Qualité</span>
          </div>
          <div className="stat">
            <span className="stat-number">🚚</span>
            <span className="stat-label">Livraison</span>
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="products-toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>✕</button>
          )}
        </div>

        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`pill ${activeCategory === cat.filter ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat.filter)}
            >
              <span className="pill-icon">{cat.icon}</span>
              <span className="pill-text">{cat.name}</span>
              {activeCategory === cat.filter && (
                <span className="pill-count">{filteredProducts.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Résultats de recherche */}
      {searchTerm && (
        <div className="search-results-info">
          <span>🔍 {filteredProducts.length} résultat(s) pour "{searchTerm}"</span>
          <button onClick={() => setSearchTerm('')}>Effacer</button>
        </div>
      )}

      {/* Grille des produits */}
      <div className="products-grid">
        {filteredProducts.map((product, index) => {
          const stockStatus = getStockStatus(product.stock);
          return (
            <div 
              key={product.id} 
              className="product-card"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Image du produit */}
              <Link to={`/products/${product.id}`} className="product-image-link">
                <div className="product-image">
                  <img src={product.imageUrl || '/placeholder-product.jpg'} alt={product.nom} />
                  
                  {/* Badges */}
                  <div className="product-badges">
                    {product.categorie && (
                      <span className={`badge category-badge ${product.categorie.toLowerCase()}`}>
                        {product.categorie}
                      </span>
                    )}
                    <span className={`badge stock-badge ${stockStatus.class}`}>
                      {stockStatus.text}
                    </span>
                  </div>

                  {/* Overlay au survol */}
                  <div className="product-overlay">
                    <span className="view-text">👁️ Voir détails</span>
                  </div>
                </div>
              </Link>

              {/* Informations du produit */}
              <div className="product-info">
                <Link to={`/products/${product.id}`} className="product-name">
                  <h3>{product.nom}</h3>
                </Link>
                
                {product.description && (
                  <p className="product-description">{product.description}</p>
                )}

                {/* Prix et unité */}
                <div className="product-pricing">
                  <div className="price-main">
                    <span className="price">{product.prix} DH</span>
                    {product.unite && (
                      <span className="unit">/ {product.unite}</span>
                    )}
                  </div>
                  {product.stock > 0 && (
                    <span className="stock-info">
                      📦 {product.stock} {product.unite || 'unités'}
                    </span>
                  )}
                </div>

                {/* Bouton d'ajout au panier */}
                <button 
                  className={`add-to-cart-btn ${addedToCart === product.id ? 'added' : ''}`}
                  onClick={(e) => handleAddToCart(product, e)}
                  disabled={product.stock <= 0}
                >
                  {addedToCart === product.id ? (
                    <>✓ Ajouté au panier</>
                  ) : product.stock <= 0 ? (
                    <>Indisponible</>
                  ) : (
                    <>🛒 Ajouter au panier</>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message si aucun produit */}
      {filteredProducts.length === 0 && (
        <div className="no-products">
          <div className="no-products-icon">🔍</div>
          <h3>Aucun produit trouvé</h3>
          <p>
            {searchTerm 
              ? `Aucun résultat pour "${searchTerm}"`
              : "Aucun produit dans cette catégorie"}
          </p>
          <button 
            className="reset-btn"
            onClick={() => { setSearchTerm(''); handleCategoryChange('all'); }}
          >
            Voir tous les produits
          </button>
        </div>
      )}
    </div>
  );
}

export default Products;
