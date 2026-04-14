import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  Shield, 
  Loader2,
  TrendingUp
} from "lucide-react";
import { fetchAdminSummary } from "../../services/adminService.js";
import { useApp } from "../../context/AppContext.jsx";

const AdminDashboard = () => {
  const { user } = useApp();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAdminSummary();
        setSummary(data);
      } catch {
        setSummary(null);
      }
    };
    if (user?.role === "admin") load();
  }, [user]);

  if (!user || user.role !== "admin") {
    return (
      <div className="page-body">
        <div className="empty-state">
          <div className="empty-state-icon">
            <Shield size={40} />
          </div>
          <h3>Admin only</h3>
          <p>Login as an admin user to access this dashboard.</p>
          <Link to="/login" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Login as Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Platform overview and key metrics.</p>
      </div>

      {summary ? (
        <>
          <div className="stats-grid" style={{ marginBottom: '24px' }}>
            <Link to="/admin/users" className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--primary-100)', color: 'var(--primary-600)' }}>
                <Users size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{summary.counts.users}</div>
                <div className="stat-label">Total Users</div>
              </div>
            </Link>

            <Link to="/admin/providers" className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--success-100)', color: 'var(--success-600)' }}>
                <Briefcase size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{summary.counts.providers}</div>
                <div className="stat-label">Service Providers</div>
              </div>
            </Link>

            <Link to="/admin/services" className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--warning-100)', color: 'var(--warning-600)' }}>
                <Calendar size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{summary.counts.bookings}</div>
                <div className="stat-label">Total Bookings</div>
              </div>
            </Link>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--success-100)', color: 'var(--success-600)' }}>
                <DollarSign size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">₹{summary.totalRevenue || 0}</div>
                <div className="stat-label">Total Revenue</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Administration</h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link className="btn btn-primary" to="/admin/users">
                <Users size={18} style={{ marginRight: '8px' }} />
                Manage Users
              </Link>
              <Link className="btn btn-secondary" to="/admin/providers">
                <Briefcase size={18} style={{ marginRight: '8px' }} />
                Manage Providers
              </Link>
              <Link className="btn btn-secondary" to="/admin/services">
                <Calendar size={18} style={{ marginRight: '8px' }} />
                Manage Services
              </Link>
              <Link className="btn btn-secondary" to="/admin/analytics">
                <TrendingUp size={18} style={{ marginRight: '8px' }} />
                Analytics
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

