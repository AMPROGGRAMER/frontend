import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
import { fetchMyBookings } from "../../services/bookingService.js";

const OrderTrackingPage = () => {
  const { user, showToast } = useApp();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMyBookings();
        // Show only active bookings (pending, accepted, confirmed)
        const active = data.filter(b => ["pending", "accepted", "confirmed"].includes(b.status));
        setBookings(active);
      } catch (e) {
        showToast("error", "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };
    if (user) load();
    else setLoading(false);
  }, [user, showToast]);

  const getStatusStep = (status) => {
    const steps = { pending: 1, accepted: 2, confirmed: 3, completed: 4 };
    return steps[status] || 1;
  };

  if (!user) {
    return (
      <div className="page-body">
        <div className="empty-state">
          <div className="empty-icon">🔐</div>
          <h3>Please login</h3>
          <p>Login to track your orders.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Order tracking</h1>
        <p>Track the status of your ongoing bookings.</p>
      </div>

      {loading ? (
        <div className="text-muted">Loading...</div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📍</div>
          <h3>No active bookings</h3>
          <p>All your bookings are completed. <Link to="/bookings" className="link">View all bookings</Link></p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="font-semibold text-lg">{b.serviceName}</div>
                  <div className="text-muted">Provider: {b.provider?.name || "Not assigned"}</div>
                  <div className="text-sm mt-1">
                    📅 {b.date ? new Date(b.date).toLocaleDateString() : "-"} {b.time}
                  </div>
                </div>
                <span className={`badge badge-${b.status}`}>{b.status}</span>
              </div>
              
              {/* Progress Tracker */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted mb-2">
                  <span>Booked</span>
                  <span>Accepted</span>
                  <span>Confirmed</span>
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4].map((step) => (
                    <React.Fragment key={step}>
                      <div 
                        className={`h-2 flex-1 rounded ${
                          step <= getStatusStep(b.status) ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Link className="btn btn-outline btn-sm" to={`/providers/${b.provider?._id}`}>
                  View Provider
                </Link>
                <Link className="btn btn-outline btn-sm" to="/chat">
                  💬 Chat
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderTrackingPage;

