import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  DollarSign, 
  CheckCircle, 
  TrendingUp, 
  Shield,
  Loader2,
  FileText,
  Calendar,
  ArrowLeft
} from "lucide-react";
import { fetchProviderBookings } from "../../services/bookingService.js";
import { fetchProviders } from "../../services/providerService.js";
import { useApp } from "../../context/AppContext.jsx";

const EarningsPage = () => {
  const { user } = useApp();
  const [earnings, setEarnings] = useState({ total: 0, completedJobs: 0 });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const providers = await fetchProviders({ includeAll: "true" });
        const myProfile = providers.find((p) => String(p.user?._id || p.user) === String(user._id));
        if (myProfile) {
          setEarnings({
            total: myProfile.earnings || 0,
            completedJobs: myProfile.completedJobs || 0
          });
        }
        const b = await fetchProviderBookings();
        setBookings(b.filter((x) => x.status === "completed"));
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === "provider") load();
    else setLoading(false);
  }, [user]);

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
        <Link to="/provider/dashboard" className="btn btn-ghost" style={{ padding: '8px' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1>Earnings</h1>
          <p>Track your income from completed jobs.</p>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-100)', color: 'var(--success-600)' }}>
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">₹{earnings.total}</div>
            <div className="stat-label">Total Earnings</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--primary-100)', color: 'var(--primary-600)' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{earnings.completedJobs}</div>
            <div className="stat-label">Completed Jobs</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--warning-100)', color: 'var(--warning-600)' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">
              ₹{earnings.completedJobs > 0 ? Math.round(earnings.total / earnings.completedJobs) : 0}
            </div>
            <div className="stat-label">Avg per Job</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '20px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={18} />
          Completed Bookings
        </h3>

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
            <Loader2 size={24} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
          </div>
        )}

        {!loading && bookings.length === 0 && (
          <div className="empty-state" style={{ padding: '40px' }}>
            <div className="empty-state-icon">
              <FileText size={32} />
            </div>
            <p>No completed bookings yet</p>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{b.serviceName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                        #{b._id?.slice(-6)}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} style={{ color: 'var(--text-tertiary)' }} />
                        {b.date ? new Date(b.date).toLocaleDateString('en-IN') : "-"}
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--success-600)' }}>
                      ₹{b.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EarningsPage;

