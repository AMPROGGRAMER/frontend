import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  User, 
  Mail, 
  MapPin, 
  Wallet, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Heart, 
  Star,
  Edit3,
  Search,
  MessageSquare
} from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import { getMyWallet } from "../../services/userService.js";
import { fetchMyBookings } from "../../services/bookingService.js";
import api from "../../services/api.js";

const ProfilePage = () => {
  const { user, showToast } = useApp();
  const [stats, setStats] = useState({
    walletBalance: 0,
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    favoritesCount: 0,
    reviewsCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const [wallet, bookings, favorites, reviews] = await Promise.all([
          getMyWallet().catch(() => ({ walletBalance: 0 })),
          fetchMyBookings().catch(() => []),
          api.get("/users/favorites").catch(() => ({ data: [] })),
          api.get("/reviews/my").catch(() => ({ data: [] }))
        ]);

        const pending = bookings.filter(b => b.status === "pending" || b.status === "accepted").length;
        const completed = bookings.filter(b => b.status === "completed").length;

        setStats({
          walletBalance: wallet.walletBalance || 0,
          totalBookings: bookings.length,
          completedBookings: completed,
          pendingBookings: pending,
          favoritesCount: favorites.data?.length || 0,
          reviewsCount: reviews.data?.length || 0
        });
      } catch (e) {
        showToast("error", "Failed to load profile stats");
      } finally {
        setLoading(false);
      }
    };

    if (user) loadStats();
    else setLoading(false);
  }, [user, showToast]);

  if (!user) {
    return (
      <div className="page-body">
        <div className="empty-state">
          <div className="empty-state-icon">
            <User size={40} />
          </div>
          <h3>Please login</h3>
          <p>Login to manage your profile.</p>
          <Link to="/login" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Login
          </Link>
        </div>
      </div>
    );
  }

  const getRoleBadge = (role) => {
    switch(role) {
      case 'admin': return <span className="badge badge-admin">Administrator</span>;
      case 'provider': return <span className="badge badge-provider">Service Provider</span>;
      default: return <span className="badge badge-user">Customer</span>;
    }
  };

  const statCards = [
    { 
      label: 'Wallet Balance', 
      value: `₹${stats.walletBalance}`, 
      icon: Wallet, 
      path: '/wallet',
      color: 'var(--success-500)'
    },
    { 
      label: 'Total Bookings', 
      value: stats.totalBookings, 
      icon: Calendar, 
      path: '/bookings',
      color: 'var(--primary-500)'
    },
    { 
      label: 'Pending', 
      value: stats.pendingBookings, 
      icon: Clock, 
      path: '/bookings',
      color: 'var(--warning-500)'
    },
    { 
      label: 'Completed', 
      value: stats.completedBookings, 
      icon: CheckCircle, 
      path: '/bookings',
      color: 'var(--success-500)'
    },
  ];

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your personal details and view your activity.</p>
      </div>

      {/* User Info Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            background: user.avatarUrl ? 'transparent' : 'var(--primary-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            fontSize: '24px',
            fontWeight: 600,
            color: 'var(--primary-700)'
          }}>
            {user.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
              />
            ) : null}
            <span style={{ display: user.avatarUrl ? 'none' : 'flex' }}>
              {user.name?.[0]?.toUpperCase()}
            </span>
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '24px' }}>{user.name}</h2>
              {getRoleBadge(user.role)}
            </div>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={14} />
              {user.email}
            </div>
            {user.city && (
              <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={14} />
                {user.city}
              </div>
            )}
          </div>
          <Link className="btn btn-primary" to="/profile/edit">
            <Edit3 size={16} style={{ marginRight: '8px' }} />
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link key={idx} to={stat.path} className="stat-card">
              <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                <Icon size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Secondary Stats */}
      <div className="grid-2" style={{ marginBottom: '24px' }}>
        <Link to="/favorites" className="card card-hover" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: 'var(--error-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--error-600)'
              }}>
                <Heart size={24} />
              </div>
              <div>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>Favorites</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {stats.favoritesCount}
                </div>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/reviews" className="card card-hover" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: 'var(--warning-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--warning-600)'
              }}>
                <Star size={24} />
              </div>
              <div>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>Reviews Given</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {stats.reviewsCount}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link className="btn btn-primary" to="/services">
            <Search size={18} style={{ marginRight: '8px' }} />
            Find Services
          </Link>
          <Link className="btn btn-secondary" to="/bookings">
            <Calendar size={18} style={{ marginRight: '8px' }} />
            My Bookings
          </Link>
          <Link className="btn btn-secondary" to="/chat">
            <MessageSquare size={18} style={{ marginRight: '8px' }} />
            Messages
          </Link>
        </div>
      </div>

      {/* Account Info */}
      <div className="card">
        <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Account Information</h3>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="form-input" style={{ background: 'var(--surface-elevated)' }}>
              {user.name}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="form-input" style={{ background: 'var(--surface-elevated)' }}>
              {user.email}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Account Type</label>
            <div className="form-input" style={{ background: 'var(--surface-elevated)', textTransform: 'capitalize' }}>
              {user.role}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">City</label>
            <div className="form-input" style={{ background: 'var(--surface-elevated)' }}>
              {user.city || "Not set"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

