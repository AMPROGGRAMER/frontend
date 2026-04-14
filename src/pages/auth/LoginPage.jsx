import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { login } from "../../services/authService.js";
import { useApp } from "../../context/AppContext.jsx";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser, showToast } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      setUser(data.user);
      showToast("success", "Welcome back!");
      
      // Redirect based on user role
      const userRole = data.user?.role;
      if (userRole === "admin") {
        navigate("/admin/dashboard");
      } else if (userRole === "provider") {
        navigate("/provider/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      showToast("error", err?.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <span role="img" aria-label="logo">🔧</span>
          </div>
          <div className="auth-logo-text">ServeLocal</div>
          <div className="auth-logo-subtitle">Welcome back! Please login to continue.</div>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ 
                position: 'absolute', 
                left: '14px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--text-tertiary)'
              }} />
              <input
                className="form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ 
                position: 'absolute', 
                left: '14px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--text-tertiary)'
              }} />
              <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          <button 
            className="btn btn-primary btn-lg w-full" 
            disabled={loading} 
            type="submit"
            style={{ marginTop: '8px' }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
            Don&apos;t have an account?{' '}
            <Link to="/register" className="auth-link">
              Create one now
            </Link>
          </p>
          <Link 
            to="/forgot-password" 
            style={{ 
              color: 'var(--text-tertiary)', 
              fontSize: '13px',
              textDecoration: 'none'
            }}
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

