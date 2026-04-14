import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  PlusCircle,
  Loader2,
  Shield,
  Save,
  X,
  Tag
} from "lucide-react";
import {
  getProviderServices,
  deleteService,
  updateService
} from "../../services/serviceService.js";
import { fetchCategories } from "../../services/categoryService.js";
import { useApp } from "../../context/AppContext.jsx";

const ManageServicesPage = () => {
  const { user, showToast } = useApp();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", category: "", customCategory: "", price: "", description: "" });

  const load = async () => {
    try {
      setLoading(true);
      const data = await getProviderServices();
      setServices(data || []);
    } catch (e) {
      showToast("error", "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "provider") load();
    else setLoading(false);
  }, [user, showToast]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data || []);
      } catch (e) {
        showToast("error", "Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, [showToast]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await deleteService(id);
      showToast("success", "Service deleted successfully");
      // Remove from local state immediately for better UX
      setServices(prev => prev.filter(s => s._id !== id));
    } catch (e) {
      console.error("Delete service error:", e);
      showToast("error", e?.response?.data?.message || "Failed to delete service");
      // Reload to ensure state is in sync
      await load();
    }
  };

  const startEdit = (s) => {
    setEditing(s._id);
    // Check if the service category is in our categories list
    const categoryExists = categories.some(cat => cat.name === s.category);
    setForm({
      title: s.title || "",
      category: categoryExists ? s.category || "" : "Other",
      customCategory: categoryExists ? "" : s.category || "",
      price: s.price || "",
      description: s.description || ""
    });
  };

  const saveEdit = async () => {
    try {
      // Use customCategory if "Other" is selected
      const finalCategory = form.category === "Other" ? form.customCategory : form.category;
      if (!finalCategory) {
        showToast("error", "Please select or enter a category");
        return;
      }
      await updateService(editing, {
        title: form.title,
        category: finalCategory,
        price: Number(form.price),
        description: form.description
      });
      showToast("success", "Saved");
      setEditing(null);
      await load();
    } catch (e) {
      showToast("error", "Failed to save");
    }
  };

  const toggleActive = async (s) => {
    try {
      await updateService(s._id, { active: !s.active });
      await load();
    } catch (e) {
      showToast("error", "Failed to update");
    }
  };

  if (!user || user.role !== "provider") {
    return (
      <div className="page-body">
        <div className="empty-state">
          <div className="empty-state-icon">
            <Shield size={40} />
          </div>
          <h3>Provider access only</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1>My Services</h1>
          <p>Manage your service offerings and pricing.</p>
        </div>
        <Link to="/provider/add-service" className="btn btn-primary">
          <PlusCircle size={18} style={{ marginRight: '8px' }} />
          Add New Service
        </Link>
      </div>

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
        </div>
      )}

      {!loading && services.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Package size={40} />
          </div>
          <h3>No services listed</h3>
          <p>Create your first service offering to start receiving bookings.</p>
          <Link to="/provider/add-service" className="btn btn-primary" style={{ marginTop: '16px' }}>
            <PlusCircle size={18} style={{ marginRight: '8px' }} />
            Add Service
          </Link>
        </div>
      )}

      <div className="grid-auto">
        {services.map((s) => (
          <div key={s._id} className="card" style={{ padding: '20px' }}>
            {editing === s._id ? (
              <div>
                <div className="grid-2" style={{ marginBottom: '16px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Title</label>
                    <input
                      className="form-input"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">
                      <Tag size={14} style={{ marginRight: '6px', display: 'inline' }} />
                      Category {loadingCategories && <Loader2 size={14} className="animate-spin" style={{ display: 'inline', marginLeft: '4px' }} />}
                    </label>
                    <select
                      className="form-input form-select"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value, customCategory: "" })}
                      disabled={loadingCategories}
                    >
                      <option value="">{loadingCategories ? "Loading..." : "Select a category"}</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                      ))}
                      <option value="Other">Other (Specify below)</option>
                    </select>
                    {form.category === "Other" && (
                      <input
                        className="form-input"
                        style={{ marginTop: '10px' }}
                        required
                        value={form.customCategory}
                        onChange={(e) => setForm({ ...form, customCategory: e.target.value })}
                        placeholder="Enter custom category name"
                      />
                    )}
                  </div>
                </div>
                <div className="grid-2" style={{ marginBottom: '16px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Price (₹)</label>
                    <input
                      className="form-input"
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Description</label>
                    <input
                      className="form-input"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-primary btn-sm" onClick={saveEdit}>
                    <Save size={14} style={{ marginRight: '6px' }} />
                    Save
                  </button>
                  <button className="btn btn-outline btn-sm" onClick={() => setEditing(null)}>
                    <X size={14} style={{ marginRight: '6px' }} />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '12px', 
                      background: s.active ? 'var(--success-100)' : 'var(--neutral-100)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: s.active ? 'var(--success-600)' : 'var(--neutral-500)'
                    }}>
                      <Package size={24} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '16px' }}>{s.title}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{s.category}</div>
                    </div>
                  </div>
                  <span className={`badge badge-${s.active ? 'success' : 'secondary'}`}>
                    {s.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px', minHeight: '40px' }}>
                  {s.description || 'No description provided'}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    ₹{s.price}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => startEdit(s)}>
                      <Edit2 size={14} style={{ marginRight: '6px' }} />
                      Edit
                    </button>
                    <button className="btn btn-outline btn-sm" onClick={() => toggleActive(s)}>
                      {s.active ? (
                        <><ToggleRight size={14} style={{ marginRight: '6px' }} /> Disable</>
                      ) : (
                        <><ToggleLeft size={14} style={{ marginRight: '6px' }} /> Enable</>
                      )}
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s._id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageServicesPage;

