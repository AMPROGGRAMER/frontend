import React, { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { fetchProviders, updateMyProviderProfile } from "../../services/providerService.js";

const PortfolioPage = () => {
  const { user, showToast } = useApp();
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const providers = await fetchProviders({ includeAll: "true" });
        const myProfile = providers.find((p) => String(p.user?._id || p.user) === String(user._id));
        setPortfolio(myProfile?.portfolio || []);
      } catch (e) {
        showToast("error", "Failed to load portfolio");
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === "provider") load();
    else setLoading(false);
  }, [user, showToast]);

  const handleAdd = async () => {
    if (!title.trim() || !imageUrl.trim()) {
      showToast("error", "Please fill all fields");
      return;
    }
    try {
      setSaving(true);
      const newItem = { title, imageUrl, createdAt: new Date() };
      await updateMyProviderProfile({
        portfolio: [...portfolio, newItem]
      });
      setPortfolio((prev) => [...prev, newItem]);
      setTitle("");
      setImageUrl("");
      setShowForm(false);
      showToast("success", "Portfolio item added");
    } catch (e) {
      showToast("error", "Failed to add");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (index) => {
    try {
      const updated = portfolio.filter((_, i) => i !== index);
      await updateMyProviderProfile({ portfolio: updated });
      setPortfolio(updated);
      showToast("success", "Item removed");
    } catch (e) {
      showToast("error", "Failed to remove");
    }
  };

  if (!user || user.role !== "provider") {
    return (
      <div className="page-body">
        <div className="empty-state">
          <div className="empty-icon">🔐</div>
          <h3>Provider access only</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Portfolio</h1>
        <p>Showcase your past work with photos and descriptions.</p>
      </div>

      <button
        className="btn btn-primary btn-sm mb-4"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "➕ Add Portfolio Item"}
      </button>

      {showForm && (
        <div className="card mb-4">
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Kitchen Renovation"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input
                className="form-input"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
          <button
            className="btn btn-primary btn-sm mt-2"
            onClick={handleAdd}
            disabled={saving}
          >
            {saving ? "Adding..." : "Add Item"}
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-muted">Loading...</div>
      ) : portfolio.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📸</div>
          <h3>No portfolio items</h3>
          <p>Add photos of your past work to showcase your skills.</p>
        </div>
      ) : (
        <div className="grid-auto">
          {portfolio.map((item, index) => (
            <div key={index} className="card">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-48 object-cover rounded mb-3"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                }}
              />
              <div className="font-semibold">{item.title}</div>
              <button
                className="btn btn-outline btn-sm mt-2"
                onClick={() => handleDelete(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;

