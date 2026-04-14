import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  CheckCircle, 
  Star, 
  DollarSign, 
  Package, 
  ClipboardList, 
  PlusCircle,
  Clock,
  TrendingUp,
  Briefcase,
  MapPin,
  Edit3,
  Loader2,
  Shield,
  MessageSquare
} from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import { fetchProviderBookings } from "../../services/bookingService.js";
import { fetchProviders, updateMyProviderProfile } from "../../services/providerService.js";
import { getProviderServices } from "../../services/serviceService.js";
import api from "../../services/api.js";

const ProviderDashboard = () => {
  const { user, showToast } = useApp();
  const [stats, setStats] = useState({
    upcoming: 0,
    completed: 0,
    rating: 0,
    earnings: 0,
    servicesCount: 0,
    reviewsCount: 0,
    totalBookings: 0
  });
  const [price, setPrice] = useState("");
  const [available, setAvailable] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [bookings, services, providers] = await Promise.all([
          fetchProviderBookings(),
          getProviderServices(),
          fetchProviders({ includeAll: "true" })
        ]);

        const upcoming = bookings.filter((b) => b.status === "pending" || b.status === "accepted").length;
        const completed = bookings.filter((b) => b.status === "completed").length;

        const myProfile = providers.find((p) => String(p.user?._id || p.user) === String(user._id));

        // Get provider reviews count
        let reviewsCount = 0;
        if (myProfile) {
          try {
            const { data } = await api.get("/reviews/provider/my");
            reviewsCount = data?.length || 0;
          } catch (e) {
            // ignore
          }
        }

        if (myProfile) {
          setProfile(myProfile);
          setStats({
            upcoming,
            completed,
            totalBookings: bookings.length,
            rating: myProfile.rating || 0,
            earnings: myProfile.earnings || 0,
            servicesCount: services.length,
            reviewsCount
          });
          setPrice(myProfile.priceFrom || "");
          setAvailable(myProfile.available !== false);
        } else {
          setStats({
            upcoming,
            completed,
            totalBookings: bookings.length,
            rating: 0,
            earnings: 0,
            servicesCount: services.length,
            reviewsCount: 0
          });
        }
      } catch {
        // ignore
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
          <p>Login as a provider account to view this dashboard.</p>
          <Link to="/login" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Login as Provider
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateMyProviderProfile({
        priceFrom: price ? Number(price) : undefined,
        available
      });
      showToast("success", "Saved");
    } catch (e) {
      showToast("error", "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Provider Dashboard</h1>
        <p>Manage your services, bookings, and earnings in one place.</p>
      </div>

      {/* Provider Info Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            background: profile?.avatarUrl ? 'transparent' : 'var(--primary-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            fontSize: '32px',
            fontWeight: 600,
            color: 'var(--primary-700)'
          }}>
            {profile?.avatarUrl ? (
              <img 
                src={profile.avatarUrl} 
                alt={profile?.name || user.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
              />
            ) : null}
            <span style={{ display: profile?.avatarUrl ? 'none' : 'flex' }}>
              {(profile?.name || user.name)[0].toUpperCase()}
            </span>
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '24px' }}>{profile?.name || user.name}</h2>
              <span className="badge badge-provider">Service Provider</span>
              {profile?.approved ? (
                <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle size={12} /> Verified
                </span>
              ) : (
                <span className="badge badge-warning">Pending Approval</span>
              )}
            </div>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{user.email}</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {profile?.category && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <Briefcase size={14} /> {profile.category}
                </span>
              )}
              {profile?.city && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <MapPin size={14} /> {profile.city}
                </span>
              )}
            </div>
          </div>
          <Link className="btn btn-primary" to="/profile/edit">
            <Edit3 size={16} style={{ marginRight: '8px' }} />
            Edit Profile
          </Link>
        </div>
        {profile?.bio && (
          <div style={{ marginTop: '16px', padding: '16px', background: 'var(--surface-elevated)', borderRadius: '12px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>{profile.bio}</p>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <Link to="/provider/booking-requests" className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--warning-100)', color: 'var(--warning-600)' }}>
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.upcoming}</div>
            <div className="stat-label">Upcoming Bookings</div>
          </div>
        </Link>

        <Link to="/provider/booking-requests" className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-100)', color: 'var(--success-600)' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Completed Jobs</div>
          </div>
        </Link>

        <Link to="/provider/reviews" className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--warning-100)', color: 'var(--warning-600)' }}>
            <Star size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{Number(stats.rating || 0).toFixed(1)}</div>
            <div className="stat-label">Rating ({stats.reviewsCount} reviews)</div>
          </div>
        </Link>

        <Link to="/provider/earnings" className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-100)', color: 'var(--success-600)' }}>
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">₹{stats.earnings}</div>
            <div className="stat-label">Total Earnings</div>
          </div>
        </Link>
      </div>

      {/* Secondary Stats */}
      <div className="grid-2" style={{ marginBottom: '24px' }}>
        <Link to="/provider/services" className="card card-hover" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: 'var(--primary-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-600)'
              }}>
                <Package size={24} />
              </div>
              <div>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>My Services</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{stats.servicesCount}</div>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/provider/booking-requests" className="card card-hover" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: 'var(--info-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--info-600)'
              }}>
                <ClipboardList size={24} />
              </div>
              <div>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>Total Bookings</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{stats.totalBookings}</div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link className="btn btn-primary" to="/provider/add-service">
            <PlusCircle size={18} style={{ marginRight: '8px' }} />
            Add Service
          </Link>
          <Link className="btn btn-secondary" to="/provider/services">
            <Package size={18} style={{ marginRight: '8px' }} />
            My Services
          </Link>
          <Link className="btn btn-secondary" to="/provider/booking-requests">
            <ClipboardList size={18} style={{ marginRight: '8px' }} />
            Booking Requests
          </Link>
          <Link className="btn btn-secondary" to="/provider/earnings">
            <DollarSign size={18} style={{ marginRight: '8px' }} />
            Earnings
          </Link>
          <Link className="btn btn-secondary" to="/chat">
            <MessageSquare size={18} style={{ marginRight: '8px' }} />
            Messages
          </Link>
        </div>
      </div>

      {/* Service Settings */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>Service Settings</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>Update your base price and availability status.</p>
        <form onSubmit={handleSave}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Base Price (₹)</label>
              <input
                className="form-input"
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 499"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Availability Status</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', height: '44px' }}>
                <button
                  type="button"
                  className={`btn ${available ? 'btn-success' : 'btn-outline'}`}
                  onClick={() => setAvailable(true)}
                  style={{ flex: 1 }}
                >
                  <CheckCircle size={16} style={{ marginRight: '6px' }} />
                  Available
                </button>
                <button
                  type="button"
                  className={`btn ${!available ? 'btn-danger' : 'btn-outline'}`}
                  onClick={() => setAvailable(false)}
                  style={{ flex: 1 }}
                >
                  <Clock size={16} style={{ marginRight: '6px' }} />
                  Unavailable
                </button>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '20px' }}>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" style={{ marginRight: '8px' }} />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Provider Details */}
      <div className="card">
        <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Provider Details</h3>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Business Name</label>
            <div className="form-input" style={{ background: 'var(--surface-elevated)' }}>
              {profile?.name || user.name}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <div className="form-input" style={{ background: 'var(--surface-elevated)' }}>
              {profile?.category || "Not set"}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">City</label>
            <div className="form-input" style={{ background: 'var(--surface-elevated)' }}>
              {profile?.city || "Not set"}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <div className="form-input" style={{ background: 'var(--surface-elevated)' }}>
              {profile?.phone || "Not set"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;

