import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, User, Loader2, FileText, AlertCircle, CreditCard, Star } from "lucide-react";
import { fetchMyBookings, payBookingWithWallet } from "../../services/bookingService.js";
import { createReview } from "../../services/reviewService.js";
import { useApp } from "../../context/AppContext.jsx";

const StatusBadge = ({ status }) => {
  const variants = {
    pending: { variant: "warning", label: "Pending" },
    confirmed: { variant: "info", label: "Confirmed" },
    completed: { variant: "success", label: "Completed" },
    cancelled: { variant: "error", label: "Cancelled" },
    accepted: { variant: "info", label: "Accepted" },
    inprogress: { variant: "inprogress", label: "In Progress" }
  };

  const config = variants[status?.toLowerCase()] || { variant: "default", label: status };
  
  return <span className={`badge badge-${config.variant}`}>{config.label}</span>;
};

const BookingsPage = () => {
  const { user, showToast } = useApp();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMyBookings();
        setBookings(data);
      } finally {
        setLoading(false);
      }
    };
    if (user) load();
    else setLoading(false);
  }, [user]);

  const handlePay = async (bookingId) => {
    try {
      setPayingId(bookingId);
      await payBookingWithWallet(bookingId);
      showToast("success", "Payment successful!");
      // Refresh bookings
      const data = await fetchMyBookings();
      setBookings(data);
    } catch (err) {
      showToast("error", err?.response?.data?.message || "Payment failed");
    } finally {
      setPayingId(null);
    }
  };

  if (!user) {
    return (
      <div className="page-body">
        <div className="empty-state">
          <div className="empty-state-icon">
            <User size={40} />
          </div>
          <h3>Please login</h3>
          <p>Login to see your bookings.</p>
          <Link to="/login" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>My Bookings</h1>
        <p>Track your service appointments and their status.</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
        </div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Calendar size={40} />
          </div>
          <h3>No bookings yet</h3>
          <p>Book a professional service to see it here.</p>
          <Link to="/services" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Browse Services
          </Link>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Provider</th>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '10px', 
                        background: 'var(--accent-gradient)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '18px'
                      }}>
                        🔧
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{b.serviceName}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                          <FileText size={12} style={{ display: 'inline', marginRight: '4px' }} />
                          Booking #{b._id?.slice(-6)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="avatar avatar-sm">
                        {(b.provider?.name || "P")[0].toUpperCase()}
                      </div>
                      <span>{b.provider?.name || "Unknown"}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} style={{ color: 'var(--text-tertiary)' }} />
                        {b.date ? new Date(b.date).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        }) : "-"}
                      </div>
                      {b.time && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                          <Clock size={14} style={{ color: 'var(--text-tertiary)' }} />
                          {b.time}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={b.status} />
                  </td>
                  <td>
                    <span className={`badge badge-${b.paymentStatus === 'paid' ? 'success' : 'warning'}`}>
                      {b.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    ₹{b.amount}
                  </td>
                  <td>
                    {b.paymentStatus !== 'paid' && (b.status === 'pending' || b.status === 'accepted') && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handlePay(b._id)}
                        disabled={payingId === b._id}
                      >
                        <CreditCard size={14} style={{ marginRight: '4px' }} />
                        {payingId === b._id ? 'Processing...' : 'Pay Now'}
                      </button>
                    )}
                    {b.paymentStatus === 'paid' && b.status === 'completed' && (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setReviewModal(b)}
                      >
                        <Star size={14} style={{ marginRight: '4px' }} />
                        Leave Review
                      </button>
                    )}
                    {b.paymentStatus === 'paid' && b.status !== 'completed' && (
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Paid</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            width: '90%',
            maxWidth: '450px',
            border: '1px solid var(--border)'
          }}>
            <h3 style={{ marginBottom: '8px' }}>Leave a Review</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
              For: {reviewModal.serviceName} with {reviewModal.provider?.name}
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Rating</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '28px',
                      cursor: 'pointer',
                      color: star <= reviewData.rating ? '#f59e0b' : 'var(--text-muted)'
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Comment (optional)</label>
              <textarea
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                placeholder="Share your experience..."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  color: 'var(--text-primary)',
                  minHeight: '100px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setReviewModal(null);
                  setReviewData({ rating: 5, comment: "" });
                }}
                disabled={submittingReview}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={async () => {
                  try {
                    setSubmittingReview(true);
                    await createReview({
                      bookingId: reviewModal._id,
                      providerId: reviewModal.provider?._id,
                      rating: reviewData.rating,
                      comment: reviewData.comment
                    });
                    showToast("success", "Review submitted successfully!");
                    setReviewModal(null);
                    setReviewData({ rating: 5, comment: "" });
                    // Refresh bookings to update UI
                    const data = await fetchMyBookings();
                    setBookings(data);
                  } catch (err) {
                    showToast("error", err?.response?.data?.message || "Failed to submit review");
                  } finally {
                    setSubmittingReview(false);
                  }
                }}
                disabled={submittingReview}
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;

