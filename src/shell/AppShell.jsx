import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import {
  Home,
  Grid,
  Briefcase,
  Calendar,
  MapPin,
  Heart,
  Wallet,
  Bell,
  MessageSquare,
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  DollarSign,
  Users,
  LogOut,
  Moon,
  Sun,
  Menu,
  BarChart3,
  Shield
} from "lucide-react";

const AppShell = () => {
  const { theme, setTheme, user, setUser, showToast } = useApp();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const logout = () => {
    localStorage.removeItem("sl_token");
    setUser(null);
    showToast("info", "Logged out successfully");
  };

  const navSections = [
    {
      title: "Discover",
      items: [
        { path: "/", label: "Home", icon: Home },
        { path: "/categories", label: "Categories", icon: Grid },
        { path: "/services", label: "Services", icon: Briefcase },
      ],
    },
    {
      title: "My Account",
      items: [
        { path: "/bookings", label: "My Bookings", icon: Calendar },
        { path: "/order-tracking", label: "Track Orders", icon: MapPin },
        { path: "/favorites", label: "Favorites", icon: Heart },
        { path: "/wallet", label: "Wallet", icon: Wallet },
        { path: "/notifications", label: "Notifications", icon: Bell },
        { path: "/chat", label: "Messages", icon: MessageSquare },
      ],
    },
  ];

  const providerSection = user?.role === "provider" ? {
    title: "Provider",
    items: [
      { path: "/provider/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { path: "/provider/services", label: "My Services", icon: Briefcase },
      { path: "/provider/add-service", label: "Add Service", icon: PlusCircle },
      { path: "/provider/booking-requests", label: "Booking Requests", icon: ClipboardList },
      { path: "/provider/earnings", label: "Earnings", icon: DollarSign },
    ],
  } : null;

  const adminSection = user?.role === "admin" ? {
    title: "Admin",
    items: [
      { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { path: "/admin/users", label: "Users", icon: Users },
      { path: "/admin/providers", label: "Providers", icon: Briefcase },
      { path: "/admin/services", label: "Services", icon: Grid },
      { path: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      { path: "/admin/reviews", label: "Reviews", icon: Shield },
    ],
  } : null;

  const allSections = [...navSections];
  if (providerSection) allSections.push(providerSection);
  if (adminSection) allSections.push(adminSection);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const ThemeIcon = theme === "dark" ? Sun : Moon;

  return (
    <div className="app-shell">
      {/* Mesh Gradient Background */}
      <div className="mesh-gradient" />
      
      {/* Mobile Menu Overlay */}
      <div 
        className={`sidebar-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-logo">
            <div className="brand-icon">
              <Briefcase size={20} />
            </div>
            <div className="brand-text">ServeLocal</div>
          </div>
          <div className="brand-subtitle">India&apos;s trusted local services</div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {allSections.map((section, idx) => (
            <div key={idx} className="nav-section">
              <div className="nav-section-title">{section.title}</div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    className={`nav-item ${active ? "active" : ""}`}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="nav-icon">
                      <Icon size={18} />
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          {user ? (
            <>
              <div className="user-card">
                <div className="avatar avatar-md">{(user?.name || "G")[0].toUpperCase()}</div>
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  <div className="user-role">
                    {user.role === "admin" ? "Administrator" : 
                     user.role === "provider" ? "Service Provider" : "Customer"}
                  </div>
                </div>
              </div>
              <div className="sidebar-actions">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={toggleTheme}
                  type="button"
                  title="Toggle theme"
                >
                  <ThemeIcon size={16} />
                </button>
                <button 
                  className="btn btn-outline btn-sm" 
                  onClick={logout}
                  type="button"
                  aria-label="Log out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="user-card">
                <div className="avatar avatar-md">G</div>
                <div className="user-info">
                  <div className="user-name">Guest</div>
                  <div className="user-role">Not logged in</div>
                </div>
              </div>
              <div className="sidebar-actions">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={toggleTheme}
                  type="button"
                  title="Toggle theme"
                >
                  <ThemeIcon size={16} />
                </button>
                <Link to="/login" className="btn btn-primary btn-sm" style={{ flex: 1, textAlign: 'center' }}>
                  Login
                </Link>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-left">
            <button 
              className="menu-toggle"
              onClick={() => setMobileMenuOpen(true)}
              type="button"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            <div className="topbar-logo">ServeLocal</div>
            <div className="topbar-subtitle">Trusted local professionals</div>
          </div>
          <div className="topbar-right">
            {user && (
              <div className="flex items-center gap-3">
                <Link to="/notifications" className="btn btn-ghost" style={{ position: 'relative' }}>
                  <Bell size={20} />
                  <span className="nav-badge" style={{ position: 'absolute', top: 0, right: 0, minWidth: '18px', height: '18px', fontSize: '10px' }}>
                    3
                  </span>
                </Link>
                <Link to="/profile" className="flex items-center gap-2">
                  <div className="avatar avatar-sm">{(user?.name || "G")[0].toUpperCase()}</div>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Page Content */}
        <Outlet />
      </main>
    </div>
  );
};

export default AppShell;

