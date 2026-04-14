import React, { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { getProviderReviews } from "../../services/reviewService.js";

const ProviderReviewsPage = () => {
  const { user, showToast } = useApp();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProviderReviews();
        setReviews(data || []);
      } catch (e) {
        showToast("error", "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === "provider") load();
    else setLoading(false);
  }, [user, showToast]);

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  if (!user || user.role !== "provider") {
    return (
      <div className="page-body">
        <div className="empty-state">
          <div className="empty-icon">🔐</div>
          <h3>Provider access only</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Reviews</h1>
        <p>See what customers are saying about you.</p>
      </div>

      {reviews.length > 0 && (
        <div className="grid-3 mb-4">
          <div className="metric-card">
            <div className="metric-icon">⭐</div>
            <div className="metric-value">{averageRating}</div>
            <div className="metric-label">Average Rating</div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">📝</div>
            <div className="metric-value">{reviews.length}</div>
            <div className="metric-label">Total Reviews</div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">⭐⭐⭐⭐⭐</div>
            <div className="metric-value">{reviews.filter((r) => r.rating === 5).length}</div>
            <div className="metric-label">5-Star Reviews</div>
          </div>
        </div>
      )}

      {loading && <div className="text-muted">Loading...</div>}

      {reviews.length === 0 && !loading && (
        <div className="empty-state">
          <div className="empty-icon">⭐</div>
          <h3>No reviews yet</h3>
          <p>Complete bookings and customers will leave reviews for you.</p>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="grid-auto">
          {reviews.map((r) => (
            <div key={r._id} className="card">
              <div className="flex items-center gap-3">
                <div className="avatar">{(r.user?.name || "C")[0].toUpperCase()}</div>
                <div>
                  <div className="font-semibold">{r.user?.name || "Customer"}</div>
                  <div className="rating-row">
                    <span className="stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                    <span className="ml-2">{r.rating}/5</span>
                  </div>
                </div>
              </div>
              <p className="mt-2">{r.comment}</p>
              <div className="text-muted text-sm mt-2">{new Date(r.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderReviewsPage;

