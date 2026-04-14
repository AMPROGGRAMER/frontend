import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  ClipboardList, 
  User, 
  Calendar, 
  Clock,
  CheckCircle, 
  XCircle, 
  Loader2, 
  Shield,
  DollarSign,
  FileText,
  MapPin,
  X
} from "lucide-react";
import { fetchProviderBookings, updateBookingStatusApi } from "../../services/bookingService.js";
import { useApp } from "../../context/AppContext.jsx";
import LocationMap from "../../components/LocationMap.jsx";

const StatusBadge = ({ status }) => {
  const variants = {
    pending: { variant: "warning", label: "Pending" },
    accepted: { variant: "info", label: "Accepted" },
    confirmed: { variant: "info", label: "Confirmed" },
    completed: { variant: "success", label: "Completed" },
    cancelled: { variant: "error", label: "Cancelled" },
    rejected: { variant: "error", label: "Rejected" }
  };
  const config = variants[status?.toLowerCase()] || { variant: "default", label: status };
  return <span className={`badge badge-${config.variant}`}>{config.label}</span>;
};

const PaymentBadge = ({ status }) => {
  const variants = {
    paid: { variant: "success", label: "Paid" },
    pending: { variant: "warning", label: "Pending" },
    failed: { variant: "error", label: "Failed" }
  };
  const config = variants[status?.toLowerCase()] || { variant: "default", label: status };
  return <span className={`badge badge-${config.variant}`}>{config.label}</span>;
};

const BookingRequestsPage = () => {
  const { user, showToast } = useApp();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);

  const load = async () => {
    try {
      const data = await fetchProviderBookings();
      console.log("Fetched provider bookings:", data);
      console.log("Bookings with coordinates:", data.filter(b => b.coordinates?.lat && b.coordinates?.lng));
      setBookings(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "provider") load();
    else setLoading(false);
  }, [user]);

  const handleStatusChange = async (id, status) => {
    try {
      const updated = await updateBookingStatusApi(id, status);
      setBookings((prev) => prev.map((b) => (b._id === id ? updated : b)));
      showToast("success", `Booking ${status}`);
    } catch (e) {
      showToast("error", e?.response?.data?.message || "Failed to update");
    }
  };

  const openMapModal = (booking) => {
    console.log("Opening map for booking:", booking);
    console.log("Booking coordinates:", booking.coordinates);
    setSelectedBooking(booking);
    setShowMapModal(true);
  };

  const closeMapModal = () => {
    setSelectedBooking(null);
    setShowMapModal(false);
  };

  if (!user || user.role !== "provider") {
    return (
      <div className="page-body">
        <div className="empty-state">
          <div className="empty-state-icon">
            <Shield size={40} />
          </div>
          <h3>Provider access only</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Booking Requests</h1>
        <p>Manage and respond to customer booking requests.</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
        </div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <ClipboardList size={40} />
          </div>
          <h3>No requests yet</h3>
          <p>You'll see customer bookings here once they request your services.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Service</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="avatar avatar-sm">
                        {(b.user?.name || "C")[0].toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 500 }}>{b.user?.name || "Customer"}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{b.serviceName}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                      <FileText size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      #{b._id?.slice(-6)}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} style={{ color: 'var(--text-tertiary)' }} />
                        {b.date ? new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : "-"}
                      </div>
                      {b.time && (
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} style={{ color: 'var(--text-tertiary)' }} />
                          {b.time}
                        </div>
                      )}
                    </div>
                  </td>
                  <td><StatusBadge status={b.status} /></td>
                  <td><PaymentBadge status={b.paymentStatus} /></td>
                  <td style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    ₹{b.amount}
                  </td>
                  <td>
                    {(b.status === "pending" || b.status === "accepted" || b.status === "confirmed") && (
                      <button
                        className={`btn btn-sm ${b.coordinates?.lat && b.coordinates?.lng ? 'btn-primary' : 'btn-outline'}`}
                        type="button"
                        onClick={() => openMapModal(b)}
                        style={{ marginBottom: '8px', width: '100%' }}
                        title={b.coordinates?.lat && b.coordinates?.lng ? 'Location available' : 'No coordinates - address only'}
                      >
                        <MapPin size={14} style={{ marginRight: '4px' }} />
                        {b.coordinates?.lat && b.coordinates?.lng ? 'View Map' : 'View Address'}
                      </button>
                    )}
                    {b.status === "pending" && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn btn-success btn-sm"
                          type="button"
                          onClick={() => handleStatusChange(b._id, "accepted")}
                        >
                          <CheckCircle size={14} style={{ marginRight: '4px' }} />
                          Accept
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          type="button"
                          onClick={() => handleStatusChange(b._id, "rejected")}
                        >
                          <XCircle size={14} style={{ marginRight: '4px' }} />
                          Reject
                        </button>
                      </div>
                    )}
                    {b.status === "pending" && b.paymentStatus !== "paid" && (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                        Awaiting payment after acceptance
                      </span>
                    )}
                    {(b.status === "accepted" || b.status === "confirmed") && (
                      <button
                        className="btn btn-primary btn-sm"
                        type="button"
                        onClick={() => handleStatusChange(b._id, "completed")}
                      >
                        <CheckCircle size={14} style={{ marginRight: '4px' }} />
                        Mark Completed
                      </button>
                    )}
                    {(b.status === "completed" || b.status === "rejected" || b.status === "cancelled") && (
                      <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Map Modal */}
      {showMapModal && selectedBooking && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '700px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
                  Service Location
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {selectedBooking.serviceName} - {selectedBooking.user?.name || "Customer"}
                </p>
              </div>
              <button
                onClick={closeMapModal}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px',
                  color: 'var(--text-secondary)'
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: '20px 24px' }}>
              <div style={{ 
                borderRadius: '12px', 
                overflow: 'hidden',
                border: '1px solid var(--border-primary)',
                height: '350px'
              }}>
                <LocationMap
                  key={`map-${selectedBooking._id}-${selectedBooking.coordinates?.lat}-${selectedBooking.coordinates?.lng}-${Date.now()}`}
                  lat={selectedBooking.coordinates?.lat}
                  lng={selectedBooking.coordinates?.lng}
                  address={selectedBooking.address}
                  height="100%"
                  zoom={15}
                />
              </div>

              <div style={{
                marginTop: '20px',
                padding: '16px',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <MapPin size={20} style={{ color: 'var(--accent-primary)', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600 }}>
                      Address
                    </h4>
                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {selectedBooking.address || "No address provided"}
                    </p>
                    {selectedBooking.city && (
                      <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: 'var(--text-tertiary)' }}>
                        <strong>City:</strong> {selectedBooking.city}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div style={{
                marginTop: '20px',
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  className="btn btn-outline"
                  onClick={closeMapModal}
                >
                  Close
                </button>
                {selectedBooking.coordinates?.lat && selectedBooking.coordinates?.lng && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedBooking.coordinates.lat},${selectedBooking.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    <MapPin size={16} style={{ marginRight: '6px' }} />
                    Get Directions
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingRequestsPage;


