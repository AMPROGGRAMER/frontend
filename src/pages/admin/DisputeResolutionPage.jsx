import React, { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { getMyDisputes, createDispute, resolveDisputeAdmin } from "../../services/disputeService.js";

const DisputeResolutionPage = () => {
  const { user, showToast } = useApp();
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newDispute, setNewDispute] = useState({ bookingId: "", reason: "" });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyDisputes();
        setDisputes(data || []);
      } catch (e) {
        showToast("error", "Failed to load disputes");
      } finally {
        setLoading(false);
      }
    };
    if (user) load();
    else setLoading(false);
  }, [user, showToast]);

  const handleCreate = async () => {
    try {
      await createDispute(newDispute);
      showToast("success", "Dispute filed");
      setShowForm(false);
      setNewDispute({ bookingId: "", reason: "" });
      const data = await getMyDisputes();
      setDisputes(data || []);
    } catch (e) {
      showToast("error", "Failed to file dispute");
    }
  };

  const handleResolve = async (id) => {
    try {
      await resolveDisputeAdmin(id);
      setDisputes(prev => prev.map(d => d._id === id ? { ...d, status: "resolved" } : d));
      showToast("success", "Dispute resolved");
    } catch (e) {
      showToast("error", "Failed to resolve");
    }
  };

  if (!user) {
    return (
      <div className="page-body">
        <div className="empty-state">
          <div className="empty-icon">🔐</div>
          <h3>Please login</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Dispute resolution</h1>
        <p>Handle issues raised between customers and providers.</p>
      </div>

      {user.role === "user" && (
        <button className="btn btn-primary btn-sm mb-4" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "➕ File a Dispute"}
        </button>
      )}

      {showForm && (
        <div className="card mb-4">
          <div className="form-group">
            <label className="form-label">Booking ID</label>
            <input 
              className="form-input" 
              value={newDispute.bookingId} 
              onChange={e => setNewDispute({...newDispute, bookingId: e.target.value})}
              placeholder="Enter booking ID"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Reason</label>
            <textarea 
              className="form-input" 
              rows={3}
              value={newDispute.reason} 
              onChange={e => setNewDispute({...newDispute, reason: e.target.value})}
              placeholder="Describe the issue..."
            />
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleCreate}>Submit Dispute</button>
        </div>
      )}

      {loading ? (
        <div className="text-muted">Loading...</div>
      ) : disputes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⚖️</div>
          <h3>No disputes</h3>
          <p>No disputes have been filed.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {disputes.map((d) => (
            <div key={d._id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">Dispute #{d._id?.slice(-6)}</div>
                  <div className="text-muted text-sm">Booking: {d.booking?.serviceName || d.bookingId}</div>
                  <div className="mt-2">{d.reason}</div>
                  <div className="text-xs text-muted mt-2">
                    Filed by: {d.user?.name || "Unknown"} | {new Date(d.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <span className={`badge badge-${d.status === "resolved" ? "success" : "warning"}`}>
                  {d.status}
                </span>
              </div>
              {user.role === "admin" && d.status === "open" && (
                <div className="mt-3">
                  <button className="btn btn-primary btn-sm" onClick={() => handleResolve(d._id)}>
                    Mark Resolved
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisputeResolutionPage;

