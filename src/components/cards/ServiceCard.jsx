import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Star, 
  List,
  Tag,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  ArrowRight,
  IndianRupee
} from "lucide-react";

const ServiceCard = ({ service, isSelected }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const provider = service.provider || {};
  const hasDetails = service.description || service.features?.length || service.whatsIncluded?.length || service.requirements?.length;
  const images = service.images || [];

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
    return icons[category?.toLowerCase()] || icons.default;
  };

  const getPriceLabel = (type) => {
    switch (type) {
      case "hourly": return "/ hour";
      case "starting": return "+";
      default: return "";
    }
  };

  return (
    <div className="card service-card" style={{ 
      overflow: 'hidden',
      border: isSelected ? '3px solid var(--accent-primary)' : undefined,
      boxShadow: isSelected ? '0 0 20px rgba(59, 130, 246, 0.3)' : undefined,
      transform: isSelected ? 'scale(1.02)' : undefined,
      transition: 'all 0.2s ease'
    }}>
      {/* Selected Badge */}
      {isSelected && (
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'var(--accent-primary)',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 600,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <CheckCircle size={14} />
          Selected
        </div>
      )}
      {/* Image Gallery */}
      {images.length > 0 ? (
        <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
          <img 
            src={images[currentImage]} 
            alt={service.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.target.src = `https://via.placeholder.com/400x200?text=${encodeURIComponent(service.category || 'Service')}`; }}
          />
          {images.length > 1 && (
            <>
              <div style={{ 
                position: 'absolute', 
                bottom: '12px', 
                left: '50%', 
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '6px'
              }}>
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      border: 'none',
                      background: idx === currentImage ? 'var(--accent-primary)' : 'rgba(255,255,255,0.7)',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </>
          )}
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 500
          }}>
            {service.category}
          </div>
        </div>
      ) : (
        <div style={{ 
          height: '120px', 
          background: 'linear-gradient(135deg, var(--primary-100) 0%, var(--primary-200) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px'
        }}>
          {getCategoryIcon(service.category)}
        </div>
      )}

      <div style={{ padding: '20px' }}>
        {/* Header */}
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 600, 
            margin: '0 0 8px 0',
            color: 'var(--text-primary)'
          }}>
            {service.title}
          </h3>
          
          {service.shortDescription && (
            <p style={{ 
              fontSize: '14px', 
              color: 'var(--text-secondary)', 
              margin: 0,
              lineHeight: 1.5
            }}>
              {service.shortDescription}
            </p>
          )}
        </div>

        {/* Provider Info */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: '16px',
          padding: '12px',
          background: 'var(--bg-secondary)',
          borderRadius: '8px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--primary-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            {getCategoryIcon(provider.category)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>{provider.name || "Unknown Provider"}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={12} />
              {provider.city || provider.location || "India"}
              {provider.rating > 0 && (
                <>
                  <span style={{ margin: '0 6px' }}>•</span>
                  <Star size={12} fill="#fbbf24" stroke="#fbbf24" />
                  {provider.rating.toFixed(1)}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Price & Duration */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '16px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <IndianRupee size={20} style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--accent-primary)' }}>
              {service.price}
            </span>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              {getPriceLabel(service.priceType)}
            </span>
          </div>
          {service.duration && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
              <Clock size={16} />
              <span>{service.duration}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {service.tags?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
            {service.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} style={{
                padding: '4px 10px',
                background: 'var(--success-100)',
                color: 'var(--success-700)',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 500
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Expandable Details */}
        {hasDetails && (
          <div style={{ marginBottom: '16px' }}>
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 0',
                background: 'none',
                border: 'none',
                color: 'var(--accent-primary)',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              View Details
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {expanded && (
              <div style={{ marginTop: '12px' }}>
                {/* Description */}
                {service.description && (
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>
                      {service.description}
                    </p>
                  </div>
                )}

                {/* What's Included */}
                {service.whatsIncluded?.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ 
                      fontSize: '14px', 
                      fontWeight: 600, 
                      margin: '0 0 8px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <CheckCircle size={16} style={{ color: 'var(--success-600)' }} />
                      What's Included
                    </h4>
                    <ul style={{ 
                      listStyle: 'none', 
                      padding: 0, 
                      margin: 0,
                      fontSize: '13px',
                      color: 'var(--text-secondary)'
                    }}>
                      {service.whatsIncluded.map((item, idx) => (
                        <li key={idx} style={{ 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          gap: '8px',
                          marginBottom: '4px'
                        }}>
                          <span style={{ color: 'var(--success-600)' }}>✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Features */}
                {service.features?.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ 
                      fontSize: '14px', 
                      fontWeight: 600, 
                      margin: '0 0 8px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <Star size={16} style={{ color: 'var(--primary-600)' }} />
                      Key Features
                    </h4>
                    <ul style={{ 
                      listStyle: 'none', 
                      padding: 0, 
                      margin: 0,
                      fontSize: '13px',
                      color: 'var(--text-secondary)'
                    }}>
                      {service.features.map((item, idx) => (
                        <li key={idx} style={{ 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          gap: '8px',
                          marginBottom: '4px'
                        }}>
                          <span style={{ color: 'var(--primary-600)' }}>★</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Requirements */}
                {service.requirements?.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ 
                      fontSize: '14px', 
                      fontWeight: 600, 
                      margin: '0 0 8px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <List size={16} style={{ color: 'var(--warning-600)' }} />
                      Requirements from Customer
                    </h4>
                    <ul style={{ 
                      listStyle: 'none', 
                      padding: 0, 
                      margin: 0,
                      fontSize: '13px',
                      color: 'var(--text-secondary)'
                    }}>
                      {service.requirements.map((item, idx) => (
                        <li key={idx} style={{ 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          gap: '8px',
                          marginBottom: '4px'
                        }}>
                          <span style={{ color: 'var(--warning-600)' }}>!</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={() => navigate(`/providers/${provider._id || service.provider}`)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '14px',
            background: 'var(--accent-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '15px',
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.opacity = '0.9'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
        >
          View Provider & Book
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
