import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useApp } from "../context/AppContext.jsx";

export const useSocket = () => {
  const { user } = useApp();
  const socketRef = useRef(null);

  useEffect(() => {
    if (user?._id && !socketRef.current) {
      const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
        transports: ["websocket", "polling"]
      });
      socketRef.current = socket;

      socket.emit("join", { userId: user._id });

      socket.on("notification:new", (notif) => {
        // We can rely on AppContext showToast or a global notification store later
        console.log("New notification:", notif);
      });

      socket.on("booking:created", (booking) => {
        console.log("Booking created:", booking);
      });

      socket.on("booking:updated", (booking) => {
        console.log("Booking updated:", booking);
      });

      socket.on("chat:message", ({ chatId, message }) => {
        console.log("Chat message:", { chatId, message });
        // In ChatPage we will listen to this and update the active thread
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user?._id]);

  return socketRef.current;
};
