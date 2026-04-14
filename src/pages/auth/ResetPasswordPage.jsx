import React, { useState } from "react";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    // In a real app, send token + new password to backend.
    setDone(true);
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-logo">
          <div className="logo-big">ServeLocal</div>
          <div className="text-muted mt-1">Choose a new password</div>
        </div>
        {done ? (
          <div className="empty-state">
            <div className="empty-icon">✅</div>
            <h3>Password updated</h3>
            <p>You can now login with your new password.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label className="form-label">New password</label>
              <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-primary btn-lg w-full" type="submit">
              Update password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;

