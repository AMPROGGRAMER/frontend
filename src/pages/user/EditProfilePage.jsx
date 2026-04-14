import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, X, User, Upload } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import { updateMyProfile, uploadAvatar } from "../../services/userService.js";

const EditProfilePage = () => {
  const { user, setUser, showToast } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [city, setCity] = useState(user?.city || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      showToast("error", "Only JPEG, PNG, and WebP images are allowed");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "Image size must be less than 5MB");
      return;
    }

    try {
      setUploading(true);
      const result = await uploadAvatar(file);
      setAvatarUrl(result.avatarUrl);
      showToast("success", "Photo uploaded successfully");
    } catch (err) {
      showToast("error", err?.response?.data?.message || "Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setAvatarUrl("");
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updated = await updateMyProfile({ name, city, phone, avatarUrl });
      setUser((prev) => ({ ...prev, ...updated }));
      showToast("success", "Profile updated");
      navigate("/profile");
    } catch (e) {
      showToast("error", "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="page-body">
        <div className="empty-state">
          <div className="empty-icon">🔐</div>
          <h3>Please login</h3>
          <p>Login to edit your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Edit profile</h1>
        <p>Update your profile information and photo.</p>
      </div>
      
      <div className="card" style={{ maxWidth: '600px' }}>
        {/* Profile Photo Section */}
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <div style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: '50%', 
            background: avatarUrl ? 'transparent' : 'var(--primary-100)',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            border: '3px solid var(--primary-200)',
            position: 'relative'
          }}>
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt="Profile" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <User size={48} style={{ color: 'var(--primary-600)' }} />
            )}
            
            {/* Upload overlay button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                background: 'rgba(0,0,0,0.6)',
                color: 'white',
                border: 'none',
                padding: '8px',
                cursor: uploading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                fontSize: '12px'
              }}
            >
              {uploading ? (
                <>Uploading...</>
              ) : (
                <>
                  <Camera size={14} />
                  Change
                </>
              )}
            </button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          
          <button
            className="btn btn-secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={{ marginBottom: '8px' }}
          >
            <Upload size={16} style={{ marginRight: '6px' }} />
            {uploading ? "Uploading..." : "Upload Photo"}
          </button>
          
          {avatarUrl && (
            <button
              className="btn btn-outline btn-sm"
              onClick={handleRemovePhoto}
              style={{ display: 'block', margin: '0 auto' }}
            >
              <X size={14} style={{ marginRight: '6px' }} />
              Remove Photo
            </button>
          )}
          
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            JPEG, PNG, WebP (max 5MB)
          </p>
        </div>

        <div className="grid-2" style={{ marginBottom: '16px' }}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              className="form-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">City</label>
          <input
            className="form-input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
          />
        </div>

        <div className="flex gap-2" style={{ marginTop: '24px' }}>
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            className="btn btn-outline"
            type="button"
            onClick={() => navigate("/profile")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;

