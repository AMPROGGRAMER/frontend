import React, { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { getPublicServices, deleteServiceAdmin } from "../../services/serviceService.js";

const ManageServicesPage = () => {
  const { user, showToast } = useApp();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getPublicServices();
      setServices(data || []);
    } catch (e) {
      showToast("error", "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") load();
    else setLoading(false);
  }, [user, showToast]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await deleteServiceAdmin(id);
      showToast("success", "Service deleted");
      await load();
    } catch (e) {
      console.error("Admin delete service error:", e);
      showToast("error", e?.response?.data?.message || "Failed to delete service");
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="page-body">
        <div className="empty-state">
          <div className="empty-icon">🔐</div>
          <h3>Admin only</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Manage services</h1>
        <p>High level control over all service types on the platform.</p>
      </div>

      {loading ? (
        <div className="text-muted">Loading...</div>
      ) : services.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🧰</div>
          <h3>No services yet</h3>
          <p>Providers haven't created any services.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Provider</th>
                <th>Price</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s._id}>
                  <td>{s.title}</td>
                  <td>{s.category}</td>
                  <td>{s.provider?.name || "Unknown"}</td>
                  <td className="rupee">₹{s.price}</td>
                  <td>
                    <span className={`badge badge-${s.active ? "success" : "secondary"}`}>
                      {s.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(s._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageServicesPage;

