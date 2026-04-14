import api from "./api.js";

// Get my reviews (as a user)
export const getMyReviews = async () => {
  const { data } = await api.get("/reviews/my");
  return data;
};

// Get reviews for my provider profile (as a provider)
export const getProviderReviews = async () => {
  const { data } = await api.get("/reviews/provider/my");
  return data;
};

// Create a review for a booking
export const createReview = async (payload) => {
  const { data } = await api.post("/reviews", payload);
  return data;
};

// Admin: Get all reviews
export const getAllReviewsAdmin = async () => {
  const { data } = await api.get("/reviews/all");
  return data;
};

// Admin: Hide a review
export const hideReviewAdmin = async (reviewId) => {
  const { data } = await api.patch(`/reviews/${reviewId}/hide`);
  return data;
};

// Admin: Delete a review
export const deleteReviewAdmin = async (reviewId) => {
  const { data } = await api.delete(`/reviews/${reviewId}`);
  return data;
};
