import React, { useEffect, useState } from "react";
import { getMyWallet, addWalletFunds } from "../../services/userService.js";
import { fetchMyBookings, payBookingWithWallet } from "../../services/bookingService.js";
import { useApp } from "../../context/AppContext.jsx";

const WalletPage = () => {
  const { user, showToast } = useApp();
  const [wallet, setWallet] = useState({ walletBalance: 0, walletTransactions: [] });
  const [bookings, setBookings] = useState([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const w = await getMyWallet();
      setWallet(w);
      const b = await fetchMyBookings();
      setBookings(b || []);
    } catch (e) {
      showToast("error", "Failed to load wallet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) load();
    else setLoading(false);
  }, [user, showToast]);

  const handleAdd = async () => {
    const n = Number(amount);
    if (!n || n <= 0) {
      showToast("error", "Enter valid amount");
      return;
    }
    try {
      const w = await addWalletFunds(n);
      setWallet(w);
      setAmount("");
      showToast("success", "Funds added");
    } catch (e) {
      showToast("error", "Failed to add funds");
    }
  };

  const handlePay = async (bookingId) => {
    try {
      const res = await payBookingWithWallet(bookingId);
      showToast("success", res.message || "Paid");
      await load();
    } catch (e) {
      showToast("error", e?.response?.data?.message || "Payment failed");
    }
  };

  const unpaidBookings = bookings.filter((b) => b.paymentStatus !== "paid");

  if (!user) {
    return (
      <div className="page-body">
        <div className="empty-state">
          <div className="empty-icon">🔐</div>
          <h3>Please login</h3>
          <p>Login to view wallet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Wallet</h1>
        <p>Track your credits, refunds, and transactions.</p>
      </div>

      <div className="card">
        <div className="grid-2">
          <div>
            <div className="form-label">Current Balance</div>
            <div className="price rupee text-xl">₹{Number(wallet.walletBalance || 0).toFixed(2)}</div>
          </div>
          <div>
            <div className="form-label">Add Funds</div>
            <div className="flex gap-2">
              <input
                className="form-input"
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <button className="btn btn-primary btn-sm" type="button" onClick={handleAdd}>
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {unpaidBookings.length > 0 && (
        <div className="card mt-4">
          <div className="form-label">Unpaid Bookings</div>
          <div className="table-wrap mt-2">
            <table className="table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Amount</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {unpaidBookings.map((b) => (
                  <tr key={b._id}>
                    <td>{b.serviceName}</td>
                    <td className="rupee">₹{b.amount}</td>
                    <td className="text-right">
                      <button
                        className="btn btn-primary btn-sm"
                        type="button"
                        onClick={() => handlePay(b._id)}
                      >
                        Pay now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="card mt-4">
        <div className="form-label">Transaction History</div>
        {loading && <div className="text-muted mt-2">Loading...</div>}
        {wallet.walletTransactions?.length === 0 && !loading && (
          <div className="empty-state small mt-2">
            <div className="empty-icon small">📄</div>
            <p>No transactions yet</p>
          </div>
        )}
        {wallet.walletTransactions?.length > 0 && (
          <div className="table-wrap mt-2">
            <table className="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Reason</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {wallet.walletTransactions.map((t, i) => (
                  <tr key={i}>
                    <td className={t.type === "credit" ? "text-success" : "text-danger"}>
                      {t.type}
                    </td>
                    <td className="rupee">₹{t.amount}</td>
                    <td>{t.reason || "-"}</td>
                    <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletPage;

