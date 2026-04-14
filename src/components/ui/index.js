import React from 'react';
import { 
  Check, 
  X, 
  AlertCircle, 
  Info,
  Loader2
} from 'lucide-react';

/**
 * Button Component - Premium UI Button with variants
 */
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
    success: 'btn-success'
  };
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
    xl: 'btn-xl'
  };
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'btn-full',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2 size={size === 'sm' ? 14 : 18} className="animate-spin" />
      )}
      {!loading && Icon && iconPosition === 'left' && (
        <Icon size={size === 'sm' ? 14 : 18} />
      )}
      {children}
      {!loading && Icon && iconPosition === 'right' && (
        <Icon size={size === 'sm' ? 14 : 18} />
      )}
    </button>
  );
};

/**
 * Card Component - Premium Card Container
 */
export const Card = ({ 
  children, 
  className = '',
  hover = false,
  interactive = false,
  onClick,
  ...props 
}) => {
  const classes = [
    'card',
    hover && 'card-hover',
    interactive && 'card-interactive',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={classes} 
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * CardHeader Component
 */
export const CardHeader = ({ title, subtitle, action, className = '' }) => (
  <div className={`card-header ${className}`}>
    <div>
      {title && <h3 className="card-title">{title}</h3>}
      {subtitle && <p className="card-subtitle">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

/**
 * Input Component - Premium Form Input
 */
export const Input = ({ 
  label,
  error,
  help,
  required = false,
  fullWidth = true,
  icon: Icon,
  className = '',
  ...props 
}) => {
  return (
    <div className={`form-group ${className}`} style={{ width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <label className={`form-label ${required ? 'form-label-required' : ''}`}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <div style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: 'var(--text-tertiary)',
            pointerEvents: 'none'
          }}>
            <Icon size={18} />
          </div>
        )}
        <input
          className="form-input"
          style={Icon ? { paddingLeft: '44px' } : undefined}
          {...props}
        />
      </div>
      {error && <div className="form-error">{error}</div>}
      {help && !error && <div className="form-help">{help}</div>}
    </div>
  );
};

/**
 * Select Component - Premium Form Select
 */
export const Select = ({ 
  label,
  error,
  help,
  required = false,
  options = [],
  fullWidth = true,
  className = '',
  ...props 
}) => {
  return (
    <div className={`form-group ${className}`} style={{ width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <label className={`form-label ${required ? 'form-label-required' : ''}`}>
          {label}
        </label>
      )}
      <select className="form-input form-select" {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <div className="form-error">{error}</div>}
      {help && !error && <div className="form-help">{help}</div>}
    </div>
  );
};

/**
 * Textarea Component - Premium Form Textarea
 */
export const Textarea = ({ 
  label,
  error,
  help,
  required = false,
  fullWidth = true,
  rows = 4,
  className = '',
  ...props 
}) => {
  return (
    <div className={`form-group ${className}`} style={{ width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <label className={`form-label ${required ? 'form-label-required' : ''}`}>
          {label}
        </label>
      )}
      <textarea 
        className="form-input form-textarea" 
        rows={rows}
        {...props} 
      />
      {error && <div className="form-error">{error}</div>}
      {help && !error && <div className="form-help">{help}</div>}
    </div>
  );
};

/**
 * Badge Component - Status and Label Badges
 */
export const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  className = '' 
}) => {
  const variantClasses = {
    default: '',
    primary: 'badge-admin',
    success: 'badge-provider',
    info: 'badge-user',
    warning: 'badge-pending',
    error: 'badge-cancelled',
    pending: 'badge-pending',
    confirmed: 'badge-confirmed',
    completed: 'badge-completed',
    cancelled: 'badge-cancelled',
    inprogress: 'badge-inprogress'
  };
  
  const sizeClasses = {
    sm: 'badge-sm',
    md: '',
    lg: 'badge-lg'
  };

  const classes = [
    'badge',
    variantClasses[variant],
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ');

  return <span className={classes}>{children}</span>;
};

/**
 * Avatar Component - User Avatar with initials or image
 */
export const Avatar = ({ 
  name,
  src,
  size = 'md',
  status,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'avatar-sm',
    md: '',
    lg: 'avatar-lg',
    xl: 'avatar-xl'
  };
  
  const statusClass = status ? `avatar-status ${status === 'offline' ? 'offline' : ''}` : '';
  
  const classes = [
    'avatar',
    sizeClasses[size],
    statusClass,
    className
  ].filter(Boolean).join(' ');

  const initials = name 
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className={classes}>
      {src ? <img src={src} alt={name} /> : initials}
    </div>
  );
};

/**
 * Skeleton Component - Loading Placeholder
 */
export const Skeleton = ({ 
  type = 'text',
  width,
  height,
  circle = false,
  className = '' 
}) => {
  const typeClasses = {
    text: 'skeleton-text',
    title: 'skeleton-title',
    card: 'skeleton-card',
    circle: 'skeleton-circle'
  };

  const classes = [
    'skeleton',
    typeClasses[type] || '',
    circle && 'skeleton-circle',
    className
  ].filter(Boolean).join(' ');

  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return <div className={classes} style={style} />;
};

/**
 * EmptyState Component - Professional Empty State
 */
export const EmptyState = ({ 
  icon: Icon,
  title,
  description,
  action,
  className = '' 
}) => {
  return (
    <div className={`empty-state ${className}`}>
      <div className="empty-state-icon">
        {Icon ? <Icon size={40} /> : <span style={{ fontSize: 40 }}>📭</span>}
      </div>
      {title && <h3>{title}</h3>}
      {description && <p>{description}</p>}
      {action && <div style={{ marginTop: 'var(--space-4)' }}>{action}</div>}
    </div>
  );
};

/**
 * StatCard Component - Dashboard Stats Card
 */
export const StatCard = ({ 
  label,
  value,
  change,
  icon: Icon,
  variant = 'primary',
  className = '' 
}) => {
  const variantClasses = {
    primary: 'primary',
    success: 'success',
    warning: 'warning',
    error: 'error'
  };

  return (
    <div className={`stat-card ${className}`}>
      <div className={`stat-icon ${variantClasses[variant]}`}>
        {Icon && <Icon size={28} />}
      </div>
      <div className="stat-info">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {change && (
          <div className={`stat-change ${change >= 0 ? 'positive' : 'negative'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Toast Component - Enhanced Toast Notification
 */
export const ToastItem = ({ type, message, onClose }) => {
  const icons = {
    success: Check,
    error: X,
    warning: AlertCircle,
    info: Info
  };
  
  const Icon = icons[type] || Info;

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">
        <Icon size={14} />
      </div>
      <span style={{ flex: 1 }}>{message}</span>
      {onClose && (
        <button 
          onClick={onClose}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            color: 'var(--text-tertiary)',
            padding: '4px'
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

/**
 * SearchBar Component - Premium Search Input
 */
export const SearchBar = ({ 
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
  className = '' 
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className={`search-bar ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      <button 
        className="search-btn"
        onClick={() => onSearch && onSearch(value)}
        type="button"
      >
        Search
      </button>
    </div>
  );
};

/**
 * Tag Component - Label/Tag Display
 */
export const Tag = ({ children, className = '' }) => (
  <span className={`tag ${className}`}>{children}</span>
);

export default {
  Button,
  Card,
  CardHeader,
  Input,
  Select,
  Textarea,
  Badge,
  Avatar,
  Skeleton,
  EmptyState,
  StatCard,
  ToastItem,
  SearchBar,
  Tag
};
