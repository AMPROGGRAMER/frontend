import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, MapPin, Phone, Clock, Briefcase, User, CheckCircle } from "lucide-react";

const ProviderCard = ({ provider }) => {
  const navigate = useNavigate();

  const getCategoryIcon = (category) => {
    const icons = {
      plumber: "🔧",
      electrician: "⚡",
      cleaner: "🧹",
      tutor: "📚",
      painter: "🎨",
      carpenter: "🔨",
      gardener: "🌱",
      mechanic: "🔩",
      driver: "🚗",
      cook: "👨‍🍳",
      default: "🔧"
    };
    return icons[category?.toLowerCase()] || provider.emoji || icons.default;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} size={14} fill="#fbbf24" stroke="#fbbf24" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} style={{ position: 'relative', display: 'inline-flex' }}>
            <Star size={14} stroke="#e2e8f0" />
            <span style={{ 
              position: 'absolute', 
              overflow: 'hidden', 
              width: '50%',
              color: '#fbbf24'
            }}>
              <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
            </span>
          </span>
        );
      } else {
        stars.push(<Star key={i} size={14} stroke="#e2e8f0" />);
      }
    }
    return stars;
  };

  return (
    <div 
      className="provider-card" 
      onClick={() => navigate(`/providers/${provider._id}`)}
    >
      <div className="provider-card-cover">
        <span style={{ fontSize: '56px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}>
          {getCategoryIcon(provider.category)}
        </span>
        <div className="provider-card-cover-overlay" />
        {provider.approved && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(34, 197, 94, 0.9)',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <CheckCircle size={12} />
            Verified
          </div>
        )}
      </div>
      
      <div className="provider-card-body">
        <div className="provider-card-header">
          {/* Avatar with provider image or initial */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: provider.avatarUrl ? 'transparent' : 'var(--primary-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            border: '3px solid white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            flexShrink: 0
          }}>
            {provider.avatarUrl ? (
              <img 
                src={provider.avatarUrl} 
                alt={provider.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
              />
            ) : (
              <User size={28} style={{ color: 'var(--primary-600)' }} />
            )}
          </div>
          <div className="provider-info">
            <div className="provider-name">{provider.name}</div>
            <div className="provider-category">
              <Briefcase size={12} />
              {provider.category}
              <span style={{ margin: '0 6px', color: 'var(--text-muted)' }}>•</span>
              <MapPin size={12} />
              {provider.city || provider.location || "India"}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
              {provider.phone && (
                <div className="provider-meta">
                  <Phone size={10} style={{ marginRight: '4px' }} />
                  {provider.phone}
                </div>
              )}
              {typeof provider.experience === "number" && provider.experience > 0 && (
                <div className="provider-meta">
                  <Clock size={10} style={{ marginRight: '4px' }} />
                  {provider.experience}+ years experience
                </div>
              )}
            </div>

            <div className="provider-rating glass" style={{ padding: '6px 12px', borderRadius: '20px' }}>
              <span style={{ display: 'flex', gap: '2px' }}>
                {renderStars(Number(provider.rating || 0))}
              </span>
              <span className="rating-value">
                {Number(provider.rating || 0).toFixed(1)}
              </span>
              <span className="rating-count">
                ({provider.ratingCount || 0} reviews)
              </span>
            </div>
          </div>
        </div>

        {provider.tags && provider.tags.length > 0 && (
          <div className="provider-tags">
            {(provider.tags || []).slice(0, 3).map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="provider-footer">
          <div className="provider-price">
            <span style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>From </span>
            ₹{provider.price ?? provider.priceFrom ?? 499}
            <span> / {provider.priceUnit || "visit"}</span>
          </div>
          <button
            className="btn btn-primary btn-sm"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/booking", { state: { provider } });
            }}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;

