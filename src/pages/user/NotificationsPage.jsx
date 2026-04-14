import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { getMyNotifications, markRead, markAllRead } from "../../services/notificationService.js";
import { useApp } from "../../context/AppContext.jsx";

const timeAgo = (d) => {
  const now = new Date();
  const then = new Date(d);
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} day ago`;
};

const NotificationsPage = () => {
  const { user, showToast } = useApp();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getMyNotifications();
      setNotifications(
        data.map((n) => ({
          _id: n._id,
          title: n.type === "booking_status" ? "Booking update" : "Notification",
          desc: n.message,
          time: timeAgo(n.createdAt),
          read: n.read,
          raw: n
        }))
      );
    } catch (e) {
      showToast("error", "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [user, showToast]);

  useEffect(() => {
    if (!user?._id) return;
    const socket = io("http://localhost:5000", { transports: ["websocket", "polling"] });
    socketRef.current = socket;
    socket.emit("join", { userId: user._id });
    socket.on("notification:new", () => load());
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?._id]);

  const handleMarkRead = async (id) => {
    try {
      await markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (e) {
      showToast("error", "Failed to update");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (e) {
      showToast("error", "Failed to update");
    }
  };

  if (!user) {
    return (
      <div className="page-body">
        <div className="empty-state">
          <div className="empty-icon">🔐</div>
          <h3>Please login</h3>
          <p>Login to view notifications.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Notifications</h1>
        <p>Updates about your bookings and offers.</p>
        <button
          className="btn btn-secondary btn-sm mt-2"
          type="button"
          onClick={handleMarkAllRead}
          disabled={loading || notifications.every((n) => n.read)}
        >
          Mark all read
        </button>
      </div>
      <div className="card">
        {loading && <div className="text-muted">Loading...</div>}
        {notifications.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-icon">🔔</div>
            <h3>No notifications</h3>
          </div>
        )}
        {notifications.map((n) => (
          <div
            key={n._id}
            className="notif-item"
            style={{ opacity: n.read ? 0.7 : 1 }}
            onClick={() => handleMarkRead(n._id)}
            role="button"
          >
            <div className="notif-icon">🔔</div>
            <div className="notif-body">
              <div className="notif-title">{n.title}</div>
              <div className="notif-desc">{n.desc}</div>
              <div className="notif-time">{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;

