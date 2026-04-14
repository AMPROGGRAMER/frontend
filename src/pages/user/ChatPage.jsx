import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { 
  Send, 
  MessageSquare, 
  Loader2, 
  Lock,
  Phone,
  MoreVertical,
  Search,
  Check,
  CheckCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import { getMyThreads, getThreadMessages } from "../../services/chatService.js";
import { useApp } from "../../context/AppContext.jsx";

const formatTime = (d) => {
  if (!d) return "now";
  const date = new Date(d);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }
};

const ChatPage = () => {
  const { user, showToast } = useApp();
  const [threads, setThreads] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Load threads on mount
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getMyThreads();
        setThreads(data);
        if (data.length > 0 && !activeId) {
          setActiveId(String(data[0]._id));
        }
      } catch (e) {
        showToast("error", "Failed to load chats");
      } finally {
        setLoading(false);
      }
    };
    if (user) load();
  }, [user, showToast]);

  // Load messages when active thread changes
  useEffect(() => {
    const load = async () => {
      if (!activeId) return;
      try {
        const msgs = await getThreadMessages(activeId);
        setMessages(
          msgs.map((m) => ({
            _id: m._id,
            text: m.text,
            fromMe: String(m.sender) === String(user._id),
            time: formatTime(m.createdAt),
            date: formatDate(m.createdAt)
          }))
        );
      } catch (e) {
        showToast("error", "Failed to load messages");
      }
    };
    load();
  }, [activeId, user, showToast]);

  // Socket.io setup
  useEffect(() => {
    if (!user?._id) return;

    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      transports: ["websocket", "polling"]
    });
    socketRef.current = socket;

    socket.emit("join", { userId: user._id });

    socket.on("chat:message", ({ chatId, message }) => {
      if (String(chatId) === String(activeId)) {
        setMessages((prev) => [
          ...prev,
          {
            _id: message._id || Date.now(),
            text: message.text,
            fromMe: String(message.sender) === String(user._id),
            time: formatTime(message.createdAt),
            date: formatDate(message.createdAt)
          }
        ]);
      }
      // Update thread list preview
      setThreads((prev) =>
        prev.map((t) =>
          String(t._id) === String(chatId)
            ? {
                ...t,
                lastMessage: { text: message.text, createdAt: message.createdAt },
                lastMessageAt: message.createdAt
              }
            : t
        )
      );
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?._id, activeId, user]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const activeThread = threads.find((t) => String(t._id) === String(activeId));
  const otherName = activeThread?.otherUser?.name || "Select a chat";

  const send = () => {
    if (!input.trim() || !activeId || !socketRef.current) return;

    const payload = {
      chatId: activeId,
      senderId: user._id,
      text: input.trim()
    };

    socketRef.current.emit("chat:send", payload);

    // Optimistically add to UI
    setMessages((prev) => [
      ...prev,
      {
        _id: Date.now(),
        text: input.trim(),
        fromMe: true,
        time: "now",
        date: "Today"
      }
    ]);

    // Update thread preview
    setThreads((prev) =>
      prev.map((t) =>
        String(t._id) === String(activeId)
          ? { ...t, lastMessage: { text: input.trim(), createdAt: new Date() } }
          : t
      )
    );

    setInput("");
  };

  if (!user) {
    return (
      <div className="page-body">
        <div className="empty-state">
          <div className="empty-state-icon">
            <Lock size={40} />
          </div>
          <h3>Please login</h3>
          <p>Login to use chat.</p>
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
        <h1>Messages</h1>
        <p>Chat with your service providers and customers.</p>
      </div>

      <div className="chat-window">
        {/* Sidebar */}
        <aside className="chat-sidebar">
          <div className="chat-sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={18} />
              <span style={{ fontWeight: 600 }}>Conversations</span>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
              {threads.length} chats
            </span>
          </div>
          
          <div className="chat-list">
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                <Loader2 size={24} className="animate-spin" />
              </div>
            )}
            
            {threads.length === 0 && !loading && (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <MessageSquare size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                <p style={{ fontSize: '14px' }}>No conversations yet</p>
              </div>
            )}

            {threads.map((t) => (
              <button
                key={t._id}
                type="button"
                className={`chat-item ${String(t._id) === String(activeId) ? "active" : ""}`}
                onClick={() => setActiveId(String(t._id))}
              >
                <div className="avatar avatar-md">
                  {(t.otherUser?.name || "?")[0].toUpperCase()}
                </div>
                <div className="chat-item-info">
                  <div className="chat-item-name">{t.otherUser?.name || "Unknown"}</div>
                  <div className="chat-item-msg">
                    {t.lastMessage?.text || "No messages yet"}
                  </div>
                </div>
                <div className="chat-item-time">
                  {formatDate(t.lastMessageAt)}
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Chat Area */}
        <section className="chat-main">
          <header className="chat-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {activeThread && (
                <div className="avatar avatar-md">
                  {(activeThread.otherUser?.name || "?")[0].toUpperCase()}
                </div>
              )}
              <div>
                <div style={{ fontWeight: 600, fontSize: '15px' }}>{otherName}</div>
                {activeThread && (
                  <div style={{ fontSize: '12px', color: 'var(--success-500)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success-500)' }} />
                    Online
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-ghost" style={{ padding: '8px' }}>
                <Phone size={18} />
              </button>
              <button className="btn btn-ghost" style={{ padding: '8px' }}>
                <Search size={18} />
              </button>
              <button className="btn btn-ghost" style={{ padding: '8px' }}>
                <MoreVertical size={18} />
              </button>
            </div>
          </header>

          <div className="chat-messages">
            {messages.length === 0 && activeThread && (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%',
                color: 'var(--text-secondary)',
                textAlign: 'center'
              }}>
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '50%', 
                  background: 'var(--surface-elevated)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <MessageSquare size={28} style={{ opacity: 0.5 }} />
                </div>
                <p style={{ fontSize: '15px', marginBottom: '4px' }}>No messages yet</p>
                <p style={{ fontSize: '13px', opacity: 0.7 }}>Start the conversation by sending a message</p>
              </div>
            )}

            {messages.map((m, idx) => (
              <div key={m._id} className={`chat-msg ${m.fromMe ? "me" : ""}`}>
                <div className="chat-msg-bubble">
                  {m.text}
                  <div className="chat-msg-time" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {m.time}
                    {m.fromMe && (
                      <CheckCheck size={12} style={{ opacity: 0.7 }} />
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-row">
            <textarea
              className="chat-input"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={activeThread ? "Type a message..." : "Select a chat to start messaging"}
              disabled={!activeThread}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <button 
              className="btn btn-primary" 
              type="button" 
              onClick={send}
              disabled={!input.trim() || !activeThread}
              style={{ 
                borderRadius: '50%', 
                width: '44px', 
                height: '44px', 
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={20} />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ChatPage;

