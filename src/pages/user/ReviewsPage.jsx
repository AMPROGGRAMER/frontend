import React, { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { getMyReviews } from "../../services/reviewService.js";

const ReviewsPage = () => {
  const { user, showToast } = useApp();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyReviews();
        setReviews(data || []);
      } catch (e) {
        showToast("error", "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };
    if (user) load();
    else setLoading(false);
  }, [user, showToast]);

  if (!user) {
    return (
      <div className="page-body">
        <div className="empty-state">
          <div className="empty-icon">🔐</div>
          <h3>Please login</h3>
          <p>Login to see your reviews.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>My reviews</h1>
        <p>See reviews you have left for providers.</p>
      </div>

      {loading && <div className="text-muted">Loading...</div>}

      {reviews.length === 0 && !loading && (
        <div className="empty-state">
          <div className="empty-icon">⭐</div>
          <h3>No reviews yet</h3>
          <p>Complete a booking and leave a review for your provider.</p>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="grid-auto">
          {reviews.map((r) => (
            <div key={r._id} className="card">
              <div className="flex items-center gap-3">
                <div className="avatar">{(r.provider?.name || "P")[0].toUpperCase()}</div>
                <div>
                  <div className="font-semibold">{r.provider?.name || "Provider"}</div>
                  <div className="text-muted text-sm">{r.serviceName || "Service"}</div>
                </div>
              </div>
              <div className="mt-3">
                <div className="rating-row">
                  <span className="stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                  <span className="ml-2">{r.rating}/5</span>
                </div>
                <p className="mt-2">{r.comment}</p>
                <div className="text-muted text-sm mt-2">
                  {new Date(r.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;

