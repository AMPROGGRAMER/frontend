import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyFavorites, toggleFavoriteProvider } from "../../services/userService.js";
import { useApp } from "../../context/AppContext.jsx";

const FavoritesPage = () => {
  const { user, showToast } = useApp();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getMyFavorites();
      setFavorites(data || []);
    } catch (e) {
      showToast("error", "Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) load();
    else setLoading(false);
  }, [user, showToast]);

  const handleToggle = async (id) => {
    try {
      await toggleFavoriteProvider(id);
      await load();
      showToast("success", "Favorite removed");
    } catch (e) {
      showToast("error", "Failed to update");
    }
  };

  if (!user) {
    return (
      <div className="page-body">
        <div className="empty-state">
          <div className="empty-icon">🔐</div>
          <h3>Please login</h3>
          <p>Login to view favorites.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Favourites</h1>
        <p>Save providers you love and rebook in one tap.</p>
      </div>
      {loading && <div className="text-muted">Loading...</div>}
      {favorites.length === 0 && !loading && (
        <div className="empty-state">
          <div className="empty-icon">❤️</div>
          <h3>No favourites yet</h3>
          <p>Browse providers and add them to favorites.</p>
        </div>
      )}
      {favorites.length > 0 && (
        <div className="grid-auto">
          {favorites.map((p) => (
            <div
              key={p._id}
              className="provider-card"
              onClick={() => navigate(`/providers/${p._id}`)}
            >
              <div className="provider-card-cover">
                <span>{p.emoji || "🔧"}</span>
              </div>
              <div className="provider-card-body">
                <div className="provider-card-header">
                  <div className="provider-info">
                    <div className="provider-name">{p.name}</div>
                    <div className="provider-category">
                      {p.category} • {p.city || "India"}
                    </div>
                    <div className="rating-row mt-2">
                      <span className="stars">★★★★★</span>
                      <span>{Number(p.rating || 0).toFixed(1)}</span>
                      <span className="rating-count">({p.ratingCount || 0})</span>
                    </div>
                  </div>
                </div>
                <div className="provider-tags">
                  {(p.tags || []).slice(0, 3).map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="price-row">
                  <div className="price rupee">
                    ₹{p.price ?? p.priceFrom ?? 499}
                    <span> / {p.priceUnit || "visit"}</span>
                  </div>
                  <button
                    className="btn btn-outline btn-sm"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(p._id);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;

