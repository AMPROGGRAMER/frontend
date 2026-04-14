import React, { useState } from "react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    // In a real app call backend to send email.
    setSent(true);
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-logo">
          <div className="logo-big">ServeLocal</div>
          <div className="text-muted mt-1">Reset your password</div>
        </div>
        {sent ? (
          <div className="empty-state">
            <div className="empty-icon">📧</div>
            <h3>Check your inbox</h3>
            <p>If this email is registered, we’ll send reset instructions.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-primary btn-lg w-full" type="submit">
              Send reset link
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

