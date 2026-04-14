import React from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

// Loading spinner component
const AuthLoading = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    background: 'var(--bg)'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid var(--surface-elevated)',
      borderTop: '3px solid var(--accent-primary)',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

// Protect routes that require authentication
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useApp();
  
  // Wait for auth check to complete
  if (loading) {
    return <AuthLoading />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Protect routes that require specific role
export const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useApp();
  
  // Wait for auth check to complete
  if (loading) {
    return <AuthLoading />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === "provider") {
      return <Navigate to="/provider/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }
  
  return children;
};

// Admin only route
export const AdminRoute = ({ children }) => {
  return <RoleRoute allowedRoles={["admin"]}>{children}</RoleRoute>;
};

// Provider only route
export const ProviderRoute = ({ children }) => {
  return <RoleRoute allowedRoles={["provider"]}>{children}</RoleRoute>;
};

// User only route (not provider or admin)
export const UserRoute = ({ children }) => {
  return <RoleRoute allowedRoles={["user"]}>{children}</RoleRoute>;
};

// Route for authenticated users only (any role)
export const AuthenticatedRoute = ({ children }) => {
  return <RoleRoute allowedRoles={["user", "provider", "admin"]}>{children}</RoleRoute>;
};

export default ProtectedRoute;
