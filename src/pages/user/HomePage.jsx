import React, { useEffect, useMemo, useState } from "react";
import { Search, Sparkles, Loader2, Star, Users, Briefcase } from "lucide-react";
import ProviderCard from "../../components/cards/ProviderCard.jsx";
import CategoryCard from "../../components/CategoryCard.jsx";
import { fetchProviders } from "../../services/providerService.js";
import { fetchCategories } from "../../services/categoryService.js";

// Skeleton component for loading state
const SkeletonCard = () => (
  <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
    <div className="skeleton" style={{ height: '160px' }} />
    <div style={{ padding: '20px' }}>
      <div className="skeleton skeleton-text" style={{ width: '60%' }} />
      <div className="skeleton skeleton-text-sm" />
      <div className="skeleton skeleton-text-sm" style={{ width: '40%' }} />
    </div>
  </div>
);

const HomePage = () => {
  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProviders();
        setProviders(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return providers;
    return providers.filter((p) => (p.name || "").toLowerCase().includes(q));
  }, [providers, search]);

  return (
    <div className="page-body">
      {/* Premium Hero Section with Full Background Image */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            Premium Services
          </div>
          <h1>
            Find trusted <span>local professionals</span>
          </h1>
          <p>
            Connect with verified plumbers, electricians, cleaners, tutors, and more. 
            Book reliable home services at transparent prices.
          </p>
          <div className="hero-search">
            <div className="search-bar">
              <Search size={20} style={{ marginLeft: '16px', color: 'rgba(255,255,255,0.5)' }} />
              <input
                placeholder="Search for services or providers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="search-btn" type="button">
                <Search size={18} />
                Search
              </button>
            </div>
          </div>
          {/* Animated Stats */}
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">500+</div>
              <div className="hero-stat-label">
                <Users size={12} style={{ display: 'inline', marginRight: '4px' }} />
                Verified Pros
              </div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">10k+</div>
              <div className="hero-stat-label">
                <Briefcase size={12} style={{ display: 'inline', marginRight: '4px' }} />
                Jobs Done
              </div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">4.8</div>
              <div className="hero-stat-label">
                <Star size={12} style={{ display: 'inline', marginRight: '4px' }} />
                Avg Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section with Glassmorphism */}
      <section className="section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 className="section-title" style={{ margin: 0 }}>Popular Categories</h2>
        </div>
        
        {loadingCategories ? (
          <div className="grid-auto">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card" style={{ padding: '32px', textAlign: 'center' }}>
                <div className="skeleton skeleton-circle" style={{ width: '72px', height: '72px', margin: '0 auto 20px' }} />
                <div className="skeleton skeleton-text" style={{ width: '60%', margin: '0 auto' }} />
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📂</div>
            <h3>No categories yet</h3>
            <p>Add documents to the categories collection in MongoDB.</p>
          </div>
        ) : (
          <div className="grid-auto">
            {categories.slice(0, 8).map((cat, index) => (
              <div key={cat._id} className="scroll-reveal" style={{ animationDelay: `${index * 0.1}s` }}>
                <CategoryCard category={cat} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Providers Section */}
      <section className="section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 className="section-title" style={{ margin: 0 }}>
            {search ? `Search Results (${filtered.length})` : "Top Professionals"}
          </h2>
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
              <Loader2 size={16} className="animate-spin" />
              <span>Loading...</span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid-auto">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>No providers found</h3>
            <p>Try a different search term or browse all categories.</p>
          </div>
        ) : (
          <div className="grid-auto">
            {filtered.map((p, index) => (
              <div key={p._id} className="scroll-reveal" style={{ animationDelay: `${index * 0.05}s` }}>
                <ProviderCard provider={p} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section with Background Image */}
      <section className="cta-section">
        <div className="cta-bg" />
        <div className="cta-overlay" />
        <div className="cta-content">
          <h2 className="cta-title">Ready to get started?</h2>
          <p className="cta-description">
            Join thousands of satisfied customers who trust ServeLocal for their home service needs.
          </p>
          <button className="btn btn-xl btn-glass" style={{ fontSize: '16px', padding: '16px 40px' }}>
            Book a Service Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

