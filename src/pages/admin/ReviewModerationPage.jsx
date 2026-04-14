import React, { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { getAllReviewsAdmin, hideReviewAdmin, deleteReviewAdmin } from "../../services/reviewService.js";

const ReviewModerationPage = () => {
  const { user, showToast } = useApp();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllReviewsAdmin();
        setReviews(data || []);
      } catch (e) {
        showToast("error", "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === "admin") load();
    else setLoading(false);
  }, [user, showToast]);

  const handleHide = async (id) => {
    try {
      await hideReviewAdmin(id);
      setReviews(prev => prev.map(r => r._id === id ? { ...r, hidden: true } : r));
      showToast("success", "Review hidden");
    } catch (e) {
      showToast("error", "Failed to hide review");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await deleteReviewAdmin(id);
      setReviews(prev => prev.filter(r => r._id !== id));
      showToast("success", "Review deleted");
    } catch (e) {
      showToast("error", "Failed to delete");
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="page-body">
        <div className="empty-state">
          <div className="empty-icon">🔐</div>
          <h3>Admin only</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Review moderation</h1>
        <p>Keep your platform healthy by moderating abusive reviews.</p>
      </div>

      {loading ? (
        <div className="text-muted">Loading...</div>
      ) : reviews.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛡️</div>
          <h3>No reviews yet</h3>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Provider</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Date</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r._id} className={r.hidden ? "opacity-50" : ""}>
                  <td>{r.user?.name || "Unknown"}</td>
                  <td>{r.provider?.name || "Unknown"}</td>
                  <td>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</td>
                  <td className="max-w-xs truncate">{r.comment}</td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td>{r.hidden ? <span className="badge badge-secondary">Hidden</span> : <span className="badge badge-success">Visible</span>}</td>
                  <td className="text-right">
                    {!r.hidden && (
                      <button className="btn btn-secondary btn-sm mr-2" onClick={() => handleHide(r._id)}>
                        Hide
                      </button>
                    )}
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReviewModerationPage;
