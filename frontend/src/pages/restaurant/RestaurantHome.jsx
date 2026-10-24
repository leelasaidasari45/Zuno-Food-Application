// src/pages/restaurant/RestaurantHome.jsx
// Restaurant dashboard - shows stats, current orders, and table status

import { useState, useEffect } from "react";
import api from "../../utils/api";
import RestaurantSidebar from "../../components/RestaurantSidebar";
import "./RestaurantHome.css";

// Status options the restaurant can set
const STATUS_OPTIONS = [
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const RestaurantHome = () => {
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Fetch all three in parallel
      const [ordersRes, analyticsRes, restaurantRes] = await Promise.all([
        api.get("/orders/restaurant/all"),
        api.get("/orders/restaurant/analytics"),
        api.get("/restaurants/my/profile"),
      ]);
      setOrders(ordersRes.data);
      setAnalytics(analyticsRes.data);
      setRestaurant(restaurantRes.data);
    } catch (err) {
      console.error("Failed to load dashboard data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle status change from dropdown
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      // Update state locally (no need to reload everything)
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error("Failed to update status:", err.message);
    }
  };

  // Filter active orders (not completed or cancelled)
  const activeOrders = orders.filter(
    (o) => !["completed", "cancelled"].includes(o.status)
  );

  // Which tables are booked (from active orders)
  const bookedTables = activeOrders.map((o) => o.tableNumber);

  const totalTables = restaurant?.numberOfTables || 10;

  return (
    <div className="restaurant-layout">
      <RestaurantSidebar />

      <main className="restaurant-main">
        <div className="dashboard-page">
          {/* Page Header */}
          <div className="page-header">
            <div>
              <h1 className="page-title">Dashboard</h1>
              <p className="page-subtitle">Welcome back! Here's what's happening today.</p>
            </div>
          </div>

          {/* Stats Grid */}
          {analytics && (
            <div className="stats-grid">
              <div className="stat-card highlighted">
                <div className="stat-icon">📅</div>
                <div className="stat-value">{analytics.todayOrders}</div>
                <div className="stat-label">Today's Orders</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-value">{analytics.totalOrders}</div>
                <div className="stat-label">Total Orders</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-value">₹{analytics.totalRevenue.toFixed(0)}</div>
                <div className="stat-label">Total Revenue</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-value">{analytics.upcomingOrders?.length || 0}</div>
                <div className="stat-label">Upcoming Orders</div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="loading-wrapper">
              <div className="spinner"></div>
              <p>Loading orders...</p>
            </div>
          ) : (
            <div className="dashboard-grid">
              {/* Left: Active Orders */}
              <div className="orders-panel">
                <div className="panel-header">
                  <span className="panel-title">
                    🔥 Active Orders ({activeOrders.length})
                  </span>
                </div>

                {activeOrders.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🎉</div>
                    <h3>No active orders</h3>
                    <p>New pre-orders will appear here</p>
                  </div>
                ) : (
                  activeOrders.map((order) => (
                    <div key={order._id} className="order-row">
                      <div className="order-row-top">
                        <span className="order-customer-name">
                          {order.customer?.name}
                        </span>
                        <span className="order-id-text">
                          #{order._id.slice(-6).toUpperCase()}
                        </span>
                      </div>

                      {/* Items summary */}
                      <div className="order-row-items">
                        {order.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
                      </div>

                      <div className="order-row-footer">
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <span className="order-table-badge">
                            🪑 T{order.tableNumber}
                          </span>
                          <span className="order-arrival-time">
                            ⏰{" "}
                            {new Date(order.arrivalTime).toLocaleTimeString("en-IN", {
                              timeStyle: "short",
                            })}
                          </span>
                        </div>

                        {/* Status change dropdown */}
                        <select
                          className="status-select"
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Right: Tables Panel */}
              <div className="tables-panel">
                <div className="panel-header">
                  <span className="panel-title">🪑 Tables</span>
                </div>
                <div className="tables-grid">
                  {Array.from({ length: totalTables }, (_, i) => i + 1).map(
                    (tableNum) => {
                      const isBooked = bookedTables.includes(tableNum);
                      return (
                        <div
                          key={tableNum}
                          className={`table-cell ${isBooked ? "booked" : "free"}`}
                        >
                          <span className="table-icon">{isBooked ? "🔴" : "🟢"}</span>
                          T{tableNum}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RestaurantHome;
