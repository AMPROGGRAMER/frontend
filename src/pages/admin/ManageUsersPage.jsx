import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  Shield, 
  Trash2, 
  Loader2,
  User,
  Mail,
  Briefcase,
  Crown
} from "lucide-react";
import { deleteAdminUser, fetchAdminUsers } from "../../services/adminService.js";
import { useApp } from "../../context/AppContext.jsx";

const RoleBadge = ({ role }) => {
  const variants = {
    admin: { variant: "admin", icon: Crown, label: "Administrator" },
    provider: { variant: "provider", icon: Briefcase, label: "Provider" },
    user: { variant: "user", icon: User, label: "Customer" }
  };
  const config = variants[role?.toLowerCase()] || { variant: "default", icon: User, label: role };
  const Icon = config.icon;
  return (
    <span className={`badge badge-${config.variant}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <Icon size={12} />
      {config.label}
    </span>
  );
};

const ManageUsersPage = () => {
  const { user } = useApp();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminUsers();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") loadUsers();
  }, [user]);

  const handleDelete = async (id) => {
    // Prevent deleting yourself from this simple UI
    if (id === user?._id) {
      showToast("error", "Cannot delete your own account");
      return;
    }
    
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }
    
    try {
      await deleteAdminUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      showToast("success", "User deleted successfully");
    } catch (e) {
      console.error("Delete user error:", e);
      showToast("error", e?.response?.data?.message || "Failed to delete user");
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
        <h1>Manage Users</h1>
        <p>View and manage all registered users on the platform.</p>
      </div>

      <div className="table-wrap">
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
            <Loader2 size={24} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
          </div>
        )}

        {!loading && users.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Users size={40} />
            </div>
            <h3>No users found</h3>
          </div>
        )}

        {!loading && users.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="avatar avatar-sm">{u.name?.[0]?.toUpperCase()}</div>
                      <span style={{ fontWeight: 500 }}>{u.name}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                      <Mail size={14} />
                      {u.email}
                    </div>
                  </td>
                  <td><RoleBadge role={u.role} /></td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      type="button"
                      disabled={u._id === user._id}
                      onClick={() => handleDelete(u._id)}
                      style={{ opacity: u._id === user._id ? 0.5 : 1 }}
                    >
                      <Trash2 size={14} style={{ marginRight: '4px' }} />
                      Delete
                    </button>
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

export default ManageUsersPage;

