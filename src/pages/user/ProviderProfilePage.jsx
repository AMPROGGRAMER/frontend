import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Calendar, 
  CheckCircle, 
  Package,
  User,
  Briefcase,
  DollarSign,
  MessageSquare,
  Loader2
} from "lucide-react";
import { fetchProviderById } from "../../services/providerService.js";
import { getServicesByProvider } from "../../services/serviceService.js";
import { createBooking } from "../../services/bookingService.js";
import { getOrCreateThread } from "../../services/chatService.js";
import { useApp } from "../../context/AppContext.jsx";
import ServiceCard from "../../components/cards/ServiceCard.jsx";

const ProviderProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, showToast } = useApp();
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [providerData, servicesData] = await Promise.all([
          fetchProviderById(id),
          getServicesByProvider(id)
        ]);
        setProvider(providerData);
        setServices(servicesData.filter(s => s.active !== false));
      } catch (e) {
        showToast("error", "Failed to load provider details");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, showToast]);

  const onBook = async () => {
    if (!user) {
      showToast("info", "Please login to book");
      navigate("/login");
      return;
    }
    if (!date) {
      showToast("error", "Please select date/time");
      return;
    }
    if (!selectedService) {
      showToast("error", "Please select a service");
      return;
    }

    try {
      await createBooking({
        providerId: provider._id,
        serviceId: selectedService._id,
        serviceName: selectedService.title,
        date,
        amount: selectedService.price ?? provider.priceFrom ?? 499,
        city: provider.city,
        notes: ""
      });
      showToast("success", "Booking created successfully");
      navigate("/bookings");
    } catch (e) {
      showToast("error", "Failed to create booking");
    }
  };

  const startChat = async () => {
    if (!user) {
      showToast("info", "Please login to chat");
      navigate("/login");
      return;
    }
    try {
      await getOrCreateThread(provider.user);
      navigate("/chat");
    } catch (e) {
      showToast("error", "Failed to start chat");
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} size={16} fill="#fbbf24" stroke="#fbbf24" />);
      } else {
        stars.push(<Star key={i} size={16} stroke="#e2e8f0" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="page-body">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px' }}>
          <Loader2 size={40} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="page-body">
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>Provider not found</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      {/* Provider Header Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {/* Provider Avatar */}
          <div style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: '50%', 
            background: provider.avatarUrl ? 'transparent' : 'var(--primary-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            border: '3px solid var(--primary-200)',
            flexShrink: 0
          }}>
            {provider.avatarUrl ? (
              <img 
                src={provider.avatarUrl} 
                alt={provider.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <User size={48} style={{ color: 'var(--primary-600)' }} />
            )}
          </div>

          {/* Provider Info */}
          <div style={{ flex: 1, minWidth: '250px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>{provider.name}</h1>
              {provider.approved && (
                <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle size={12} /> Verified
                </span>
              )}
            </div>
            
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              <Briefcase size={16} style={{ display: 'inline', marginRight: '6px' }} />
              {provider.category}
              <span style={{ margin: '0 8px' }}>•</span>
              <MapPin size={16} style={{ display: 'inline', marginRight: '6px' }} />
              {provider.city || provider.location || "India"}
            </p>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ display: 'flex', gap: '2px' }}>
                {renderStars(Number(provider.rating || 0))}
              </span>
              <span style={{ fontWeight: 600 }}>{Number(provider.rating || 0).toFixed(1)}</span>
              <span style={{ color: 'var(--text-muted)' }}>({provider.ratingCount || 0} reviews)</span>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px', marginTop: '20px' }}>
              {typeof provider.experience === "number" && provider.experience > 0 && (
                <div style={{ textAlign: 'center', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
                  <Clock size={20} style={{ color: 'var(--accent-primary)', marginBottom: '4px' }} />
                  <div style={{ fontSize: '18px', fontWeight: 700 }}>{provider.experience}+</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Years Exp</div>
                </div>
              )}
              {provider.completedJobs > 0 && (
                <div style={{ textAlign: 'center', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
                  <CheckCircle size={20} style={{ color: 'var(--success-600)', marginBottom: '4px' }} />
                  <div style={{ fontSize: '18px', fontWeight: 700 }}>{provider.completedJobs}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Jobs Done</div>
                </div>
              )}
              <div style={{ textAlign: 'center', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
                <DollarSign size={20} style={{ color: 'var(--warning-600)', marginBottom: '4px' }} />
                <div style={{ fontSize: '18px', fontWeight: 700 }}>₹{provider.priceFrom ?? 499}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>From</div>
              </div>
              <div style={{ textAlign: 'center', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
                <Package size={20} style={{ color: 'var(--info-600)', marginBottom: '4px' }} />
                <div style={{ fontSize: '18px', fontWeight: 700 }}>{services.length}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Services</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        {provider.bio && (
          <div style={{ marginTop: '24px', padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600 }}>About</h4>
            <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{provider.bio}</p>
          </div>
        )}

        {/* Contact & Actions */}
        <div style={{ marginTop: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          {provider.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
              <Phone size={18} />
              <span>{provider.phone}</span>
            </div>
          )}
          <button 
            className="btn btn-secondary" 
            onClick={startChat}
            style={{ marginLeft: 'auto' }}
          >
            <MessageSquare size={18} style={{ marginRight: '8px' }} />
            Chat with Provider
          </button>
        </div>
      </div>

      {/* Services Section */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '22px', fontWeight: 600 }}>
          <Package size={24} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
          Services Offered ({services.length})
        </h2>
        
        {services.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <Package size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
            <h3>No services listed</h3>
            <p style={{ color: 'var(--text-secondary)' }}>This provider hasn't added any services yet.</p>
          </div>
        ) : (
          <div className="grid-auto">
            {services.map((service) => (
              <div 
                key={service._id}
                onClick={() => setSelectedService(selectedService?._id === service._id ? null : service)}
                style={{ cursor: 'pointer' }}
              >
                <ServiceCard 
                  service={service} 
                  isSelected={selectedService?._id === service._id}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Section */}
      {services.length > 0 && (
        <div className="card" style={{ background: 'var(--primary-50)', border: '2px solid var(--primary-200)' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>
            <Calendar size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
            Book a Service
          </h3>
          
          {selectedService ? (
            <div style={{ marginBottom: '16px', padding: '12px', background: 'white', borderRadius: '8px' }}>
              <strong>Selected:</strong> {selectedService.title} - ₹{selectedService.price}
            </div>
          ) : (
            <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--warning-100)', borderRadius: '8px', color: 'var(--warning-800)' }}>
              Please select a service above to continue
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'end' }}>
            <div>
              <label className="form-label">Select Date & Time</label>
              <input
                type="datetime-local"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ background: 'white' }}
              />
            </div>
            <button 
              className="btn btn-primary btn-lg" 
              onClick={onBook}
              disabled={!selectedService || !date}
            >
              {selectedService ? `Book Now - ₹${selectedService.price}` : 'Select Service'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderProfilePage;

