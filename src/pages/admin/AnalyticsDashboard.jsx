import React, { useEffect, useState } from "react";
import { fetchAnalytics } from "../../services/adminService.js";
import { useApp } from "../../context/AppContext.jsx";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"];

const AnalyticsDashboard = () => {
  const { user, showToast } = useApp();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const analytics = await fetchAnalytics();
        setData(analytics);
      } catch (e) {
        showToast("error", "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === "admin") load();
    else setLoading(false);
  }, [user, showToast]);

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
        <h1>Analytics</h1>
        <p>Visualise platform performance with charts and metrics.</p>
      </div>

      {loading ? (
        <div className="text-muted">Loading...</div>
      ) : !data ? (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No data available</h3>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid-4 mb-6">
            <div className="metric-card">
              <div className="metric-icon">📅</div>
              <div className="metric-value">{data.recentStats?.last7Days?.count || 0}</div>
              <div className="metric-label">Bookings (Last 7 Days)</div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">₹</div>
              <div className="metric-value">₹{data.recentStats?.last7Days?.revenue || 0}</div>
              <div className="metric-label">Revenue (Last 7 Days)</div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">👥</div>
              <div className="metric-value">
                {data.usersByRole?.reduce((acc, u) => acc + u.count, 0) || 0}
              </div>
              <div className="metric-label">Total Users</div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">🧑‍🔧</div>
              <div className="metric-value">
                {data.providersByCategory?.reduce((acc, p) => acc + p.count, 0) || 0}
              </div>
              <div className="metric-label">Total Providers</div>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid-2 mb-6">
            {/* Bookings Trend */}
            <div className="card">
              <h3 className="card-title">📈 Bookings Trend (Last 30 Days)</h3>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <AreaChart data={data.bookingsTrend || []}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis 
                      dataKey="_id" 
                      tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                      tickFormatter={(val) => val?.slice(5) || ""}
                    />
                    <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        background: "var(--surface)", 
                        border: "1px solid var(--border)",
                        borderRadius: "8px"
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#6366f1" 
                      fillOpacity={1} 
                      fill="url(#colorCount)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Revenue Trend */}
            <div className="card">
              <h3 className="card-title">💰 Revenue Trend (Last 30 Days)</h3>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <AreaChart data={data.bookingsTrend || []}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis 
                      dataKey="_id" 
                      tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                      tickFormatter={(val) => val?.slice(5) || ""}
                    />
                    <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        background: "var(--surface)", 
                        border: "1px solid var(--border)",
                        borderRadius: "8px"
                      }}
                      formatter={(val) => `₹${val}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#10b981" 
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid-3 mb-6">
            {/* Booking Status Pie */}
            <div className="card">
              <h3 className="card-title">📊 Bookings by Status</h3>
              <div style={{ width: "100%", height: 250 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={data.bookingStatus || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="_id"
                    >
                      {(data.bookingStatus || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        background: "var(--surface)", 
                        border: "1px solid var(--border)",
                        borderRadius: "8px"
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Users by Role */}
            <div className="card">
              <h3 className="card-title">👥 Users by Role</h3>
              <div style={{ width: "100%", height: 250 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={data.usersByRole || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                      nameKey="_id"
                      label
                    >
                      {(data.usersByRole || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        background: "var(--surface)", 
                        border: "1px solid var(--border)",
                        borderRadius: "8px"
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Providers by Category */}
            <div className="card">
              <h3 className="card-title">🧑‍🔧 Providers by Category</h3>
              <div style={{ width: "100%", height: 250 }}>
                <ResponsiveContainer>
                  <BarChart data={data.providersByCategory || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis 
                      dataKey="_id" 
                      tick={{ fill: "var(--text-secondary)", fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        background: "var(--surface)", 
                        border: "1px solid var(--border)",
                        borderRadius: "8px"
                      }}
                    />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Charts Row 3 */}
          <div className="grid-2 mb-6">
            {/* Revenue by Category */}
            <div className="card">
              <h3 className="card-title">💵 Revenue by Category</h3>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={data.revenueByCategory || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis 
                      dataKey="_id" 
                      tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                    />
                    <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        background: "var(--surface)", 
                        border: "1px solid var(--border)",
                        borderRadius: "8px"
                      }}
                      formatter={(val) => `₹${val}`}
                    />
                    <Bar dataKey="revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Providers */}
            <div className="card">
              <h3 className="card-title">🏆 Top 5 Providers by Bookings</h3>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart 
                    data={data.topProviders || []} 
                    layout="vertical"
                    margin={{ left: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis type="number" tick={{ fill: "var(--text-secondary)", fontSize: 12 }} />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
                      width={100}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        background: "var(--surface)", 
                        border: "1px solid var(--border)",
                        borderRadius: "8px"
                      }}
                    />
                    <Legend />
                    <Bar dataKey="bookings" fill="#6366f1" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="revenue" fill="#10b981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;

