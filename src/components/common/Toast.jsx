import React from "react";
import { Check, X, AlertCircle, Info } from "lucide-react";

const Toast = ({ toast }) => {
  if (!toast) return null;

  const icons = {
    success: Check,
    error: X,
    warning: AlertCircle,
    info: Info
  };

  const Icon = icons[toast.type] || Info;

  return (
    <div className="toast-container">
      <div className={`toast toast-${toast.type}`}>
        <div className="toast-icon">
          <Icon size={14} />
        </div>
        <span style={{ flex: 1 }}>{toast.message}</span>
      </div>
    </div>
  );
};

export default Toast;

