import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  CheckCircle,
  Trash2,
  Loader2,
  Briefcase,
  MapPin,
  Star,
  Users,
  Check
} from "lucide-react";
import {
  approveAdminProvider,
  deleteAdminProvider,
  fetchAdminProviders
} from "../../services/adminService.js";
import { useApp } from "../../context/AppContext.jsx";

const ManageProvidersPage = () => {
  const { user } = useApp();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminProviders();
      setProviders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") loadProviders();
  }, [user]);

  const handleApprove = async (id) => {
    try {
      const updated = await approveAdminProvider(id);
      setProviders((prev) => prev.map((p) => (p._id === id ? updated : p)));
      showToast("success", "Provider approved successfully");
    } catch (e) {
      console.error("Approve provider error:", e);
      showToast("error", e?.response?.data?.message || "Failed to approve provider");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this provider? This action cannot be undone.")) {
      return;
    }
    
    try {
      await deleteAdminProvider(id);
      setProviders((prev) => prev.filter((p) => p._id !== id));
      showToast("success", "Provider deleted successfully");
    } catch (e) {
      console.error("Delete provider error:", e);
      showToast("error", e?.response?.data?.message || "Failed to delete provider");
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="page-body">
        <div className="empty-state">
          <div className="empty-state-icon">
            <Shield size={40} />
          </div>
          <h3>Admin only</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Manage Providers</h1>
        <p>Review and approve service provider applications.</p>
      </div>

      <div className="table-wrap">
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
            <Loader2 size={24} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
          </div>
        )}

        {!loading && providers.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Briefcase size={40} />
            </div>
            <h3>No providers found</h3>
          </div>
        )}

        {!loading && providers.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th>Provider</th>
                <th>Category</th>
                <th>Location</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="avatar avatar-sm">{p.name?.[0]?.toUpperCase()}</div>
                      <span style={{ fontWeight: 500 }}>{p.name}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Briefcase size={14} style={{ color: 'var(--text-tertiary)' }} />
                      {p.category}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} style={{ color: 'var(--text-tertiary)' }} />
                      {p.city || "Not set"}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={14} style={{ color: 'var(--warning-500)' }} />
                      {Number(p.rating || 0).toFixed(1)}
                    </div>
                  </td>
                  <td>
                    {p.approved ? (
                      <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={12} /> Approved
                      </span>
                    ) : (
                      <span className="badge badge-warning">Pending</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {!p.approved && (
                        <button
                          className="btn btn-success btn-sm"
                          type="button"
                          onClick={() => handleApprove(p._id)}
                        >
                          <Check size={14} style={{ marginRight: '4px' }} />
                          Approve
                        </button>
                      )}
                      <button
                        className="btn btn-danger btn-sm"
                        type="button"
                        onClick={() => handleDelete(p._id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageProvidersPage;

