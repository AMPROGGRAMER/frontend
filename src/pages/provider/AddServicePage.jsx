import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Package, 
  PlusCircle, 
  DollarSign, 
  FileText, 
  Tag, 
  ToggleLeft,
  Loader2,
  Shield,
  ArrowLeft,
  Save,
  Clock,
  CheckCircle,
  List,
  Star,
  Image as ImageIcon,
  X
} from "lucide-react";
import { createService } from "../../services/serviceService.js";
import { fetchCategories } from "../../services/categoryService.js";
import { useApp } from "../../context/AppContext.jsx";

const AddServicePage = () => {
  const { user, showToast } = useApp();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [form, setForm] = useState({
    title: "",
    category: "",
    customCategory: "",
    price: "",
    priceType: "fixed",
    description: "",
    shortDescription: "",
    duration: "",
    requirements: [],
    features: [],
    whatsIncluded: [],
    tags: [],
    images: [],
    active: true
  });
  const [submitting, setSubmitting] = useState(false);

  // Temporary inputs for array fields
  const [tempRequirement, setTempRequirement] = useState("");
  const [tempFeature, setTempFeature] = useState("");
  const [tempIncluded, setTempIncluded] = useState("");
  const [tempTag, setTempTag] = useState("");
  const [tempImage, setTempImage] = useState("");

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

  const addToArray = (field, value, setTemp) => {
    if (!value.trim()) return;
    setForm(prev => ({ ...prev, [field]: [...prev[field], value.trim()] }));
    setTemp("");
  };

  const removeFromArray = (field, index) => {
    setForm(prev => ({ 
      ...prev, 
      [field]: prev[field].filter((_, i) => i !== index) 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const finalCategory = form.category === "Other" ? form.customCategory : form.category;
      if (!finalCategory) {
        showToast("error", "Please select or enter a category");
        setSubmitting(false);
        return;
      }
      await createService({
        title: form.title,
        category: finalCategory,
        price: Number(form.price),
        priceType: form.priceType,
        description: form.description,
        shortDescription: form.shortDescription,
        duration: form.duration,
        requirements: form.requirements,
        features: form.features,
        whatsIncluded: form.whatsIncluded,
        tags: form.tags,
        images: form.images,
        active: form.active
      });
      showToast("success", "Service created successfully");
      navigate("/provider/services");
    } catch (err) {
      showToast("error", err?.response?.data?.message || "Failed to create service");
    } finally {
      setSubmitting(false);
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
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link to="/provider/services" className="btn btn-ghost" style={{ padding: '8px' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1>Add New Service</h1>
          <p>Create a new service offering for your customers.</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '900px' }}>
        <form onSubmit={handleSubmit}>
          {/* Basic Info Section */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={18} />
              Basic Information
            </h3>
            
            <div className="grid-2" style={{ marginBottom: '16px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Service Title *</label>
                <input
                  className="form-input"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Deep Home Cleaning"
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">
                  Category * {loadingCategories && <Loader2 size={14} className="animate-spin" style={{ display: 'inline', marginLeft: '4px' }} />}
                </label>
                <select
                  className="form-input form-select"
                  required
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
                <label className="form-label">Short Description</label>
                <input
                  className="form-input"
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  placeholder="Brief summary (shown in cards)"
                  maxLength={100}
                />
                <small style={{ color: 'var(--text-muted)' }}>{form.shortDescription.length}/100</small>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Duration</label>
                <input
                  className="form-input"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  placeholder="e.g. 2-3 hours, 1 day"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Full Description</label>
              <textarea
                className="form-input form-textarea"
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Detailed description of what this service includes, process, etc."
              />
            </div>
          </div>

          {/* Pricing Section */}
          <div style={{ marginBottom: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarSign size={18} />
              Pricing
            </h3>
            
            <div className="grid-3" style={{ marginBottom: '16px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Price (₹) *</label>
                <input
                  className="form-input"
                  type="number"
                  required
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="Enter price"
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Price Type</label>
                <select
                  className="form-input form-select"
                  value={form.priceType}
                  onChange={(e) => setForm({ ...form, priceType: e.target.value })}
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Per Hour</option>
                  <option value="starting">Starting From</option>
                </select>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Status</label>
                <select
                  className="form-input form-select"
                  value={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.value === "true" })}
                >
                  <option value="true">Active - Visible to customers</option>
                  <option value="false">Inactive - Hidden from customers</option>
                </select>
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div style={{ marginBottom: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ImageIcon size={18} />
              Service Images
            </h3>
            
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Image URLs</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input
                  className="form-input"
                  value={tempImage}
                  onChange={(e) => setTempImage(e.target.value)}
                  placeholder="Enter image URL"
                />
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => addToArray('images', tempImage, setTempImage)}
                >
                  <PlusCircle size={18} />
                </button>
              </div>
              
              {form.images.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                  {form.images.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative', aspectRatio: '4/3' }}>
                      <img 
                        src={img} 
                        alt={`Service ${idx + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                      />
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        style={{ position: 'absolute', top: '4px', right: '4px', padding: '4px' }}
                        onClick={() => removeFromArray('images', idx)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* What's Included */}
          <div style={{ marginBottom: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={18} />
              What's Included
            </h3>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input
                className="form-input"
                value={tempIncluded}
                onChange={(e) => setTempIncluded(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('whatsIncluded', tempIncluded, setTempIncluded))}
                placeholder="e.g. All cleaning materials included"
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => addToArray('whatsIncluded', tempIncluded, setTempIncluded)}
              >
                <PlusCircle size={18} />
              </button>
            </div>
            {form.whatsIncluded.length > 0 && (
              <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', listStyle: 'none', padding: 0 }}>
                {form.whatsIncluded.map((item, idx) => (
                  <li key={idx} className="tag" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={12} />
                    {item}
                    <X size={14} style={{ cursor: 'pointer' }} onClick={() => removeFromArray('whatsIncluded', idx)} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Features */}
          <div style={{ marginBottom: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star size={18} />
              Key Features
            </h3>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input
                className="form-input"
                value={tempFeature}
                onChange={(e) => setTempFeature(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('features', tempFeature, setTempFeature))}
                placeholder="e.g. Professional equipment"
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => addToArray('features', tempFeature, setTempFeature)}
              >
                <PlusCircle size={18} />
              </button>
            </div>
            {form.features.length > 0 && (
              <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', listStyle: 'none', padding: 0 }}>
                {form.features.map((item, idx) => (
                  <li key={idx} className="tag" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--primary-100)', color: 'var(--primary-700)' }}>
                    <Star size={12} />
                    {item}
                    <X size={14} style={{ cursor: 'pointer' }} onClick={() => removeFromArray('features', idx)} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Requirements */}
          <div style={{ marginBottom: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <List size={18} />
              Requirements from Customer
            </h3>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input
                className="form-input"
                value={tempRequirement}
                onChange={(e) => setTempRequirement(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('requirements', tempRequirement, setTempRequirement))}
                placeholder="e.g. Running water connection"
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => addToArray('requirements', tempRequirement, setTempRequirement)}
              >
                <PlusCircle size={18} />
              </button>
            </div>
            {form.requirements.length > 0 && (
              <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', listStyle: 'none', padding: 0 }}>
                {form.requirements.map((item, idx) => (
                  <li key={idx} className="tag" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--warning-100)', color: 'var(--warning-700)' }}>
                    <List size={12} />
                    {item}
                    <X size={14} style={{ cursor: 'pointer' }} onClick={() => removeFromArray('requirements', idx)} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Tags */}
          <div style={{ marginBottom: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Tag size={18} />
              Tags
            </h3>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input
                className="form-input"
                value={tempTag}
                onChange={(e) => setTempTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('tags', tempTag, setTempTag))}
                placeholder="e.g. urgent, same-day, premium"
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => addToArray('tags', tempTag, setTempTag)}
              >
                <PlusCircle size={18} />
              </button>
            </div>
            {form.tags.length > 0 && (
              <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', listStyle: 'none', padding: 0 }}>
                {form.tags.map((item, idx) => (
                  <li key={idx} className="tag" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--success-100)', color: 'var(--success-700)' }}>
                    <Tag size={12} />
                    {item}
                    <X size={14} style={{ cursor: 'pointer' }} onClick={() => removeFromArray('tags', idx)} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Submit Buttons */}
          <div style={{ display: 'flex', gap: '12px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
            <button className="btn btn-primary btn-lg" type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" style={{ marginRight: '8px' }} />
                  Creating...
                </>
              ) : (
                <>
                  <Save size={18} style={{ marginRight: '8px' }} />
                  Create Service
                </>
              )}
            </button>
            <Link to="/provider/services" className="btn btn-outline btn-lg">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServicePage;

