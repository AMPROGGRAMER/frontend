import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createRazorpayOrder, verifyRazorpayPayment } from "../../services/paymentService.js";
import { useApp } from "../../context/AppContext.jsx";

const BookingConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const provider = location.state?.provider || null;
  const booking = location.state?.booking || null;
  const { showToast } = useApp();
  const [paying, setPaying] = useState(false);

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const existing = document.querySelector("script[src='https://checkout.razorpay.com/v1/checkout.js']");
      if (existing) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const onPay = async () => {
    if (!booking?._id) {
      showToast?.("error", "Missing booking");
      return;
    }
    setPaying(true);
    try {
      const ok = await loadRazorpayScript();
      if (!ok) {
        showToast?.("error", "Failed to load payment SDK");
        return;
      }

      const order = await createRazorpayOrder(booking._id);
      if (order.message === "Already paid") {
        showToast?.("success", "Already paid");
        return;
      }

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "ServeLocal",
        description: "Service booking payment",
        order_id: order.orderId,
        handler: async (response) => {
          try {
            await verifyRazorpayPayment({
              bookingId: booking._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            showToast?.("success", "Payment successful");
          } catch {
            showToast?.("error", "Payment verification failed");
          }
        }
      };

      // eslint-disable-next-line no-undef
      const rz = new window.Razorpay(options);
      rz.open();
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Booking confirmed</h1>
        <p>Your request has been placed successfully.</p>
      </div>

      <div className="card">
        <div className="empty-state">
          <div className="empty-icon">✅</div>
          <h3>You're all set!</h3>
          <p>
            We have recorded your booking
            {provider ? ` with ${provider.name}` : ""}. Track it from the bookings page.
          </p>
          {booking?.amount ? (
            <button
              className="btn btn-primary mt-4"
              type="button"
              disabled={paying}
              onClick={onPay}
            >
              {paying ? "Opening payment..." : `Pay ₹${booking.amount}`}
            </button>
          ) : null}
          <button
            className="btn btn-secondary mt-4"
            type="button"
            onClick={() => navigate("/bookings")}
          >
            Go to my bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;

