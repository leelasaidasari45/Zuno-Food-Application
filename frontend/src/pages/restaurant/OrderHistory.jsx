// src/pages/restaurant/OrderHistory.jsx
// Shows all past and current orders in a table format

import { useState, useEffect } from "react";
import api from "../../utils/api";
import RestaurantSidebar from "../../components/RestaurantSidebar";
import "./OrderHistory.css";

// Helper: pick badge style based on status
const getStatusBadgeClass = (status) => {
  const map = {
    pending: "badge-yellow",
    confirmed: "badge-blue",
    preparing: "badge-orange",
    ready: "badge-green",
    completed: "badge-green",
    cancelled: "badge-red",
  };
  return `badge ${map[status] || "badge-blue"}`;
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // filter by status

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get("/orders/restaurant/all");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load orders:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Apply status filter
  const filteredOrders = orders.filter((o) =>
    filter === "all" ? true : o.status === filter
  );

  return (
    <div className="restaurant-layout">
      <RestaurantSidebar />

      <main className="restaurant-main">
        <div className="history-page">
          <div className="page-header">
            <div>
              <h1 className="page-title">Order History</h1>
              <p className="page-subtitle">{orders.length} total orders</p>
            </div>

            {/* Filter buttons */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["all", "confirmed", "preparing", "ready", "completed", "cancelled"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={filter === s ? "btn-primary" : "btn-outline"}
                  style={{ padding: "8px 16px", fontSize: "0.8rem" }}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="loading-wrapper">
              <div className="spinner"></div>
              <p>Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No orders found</h3>
            </div>
          ) : (
            <div className="history-table-card">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Table</th>
                    <th>Arrival</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td>#{order._id.slice(-6).toUpperCase()}</td>
                      <td className="customer-name-cell">
                        {order.customer?.name}
                        <div style={{ fontSize: "0.75rem", color: "var(--text-light)", fontWeight: "400" }}>
                          {order.customer?.phone}
                        </div>
                      </td>
                      <td>
                        {order.items.map((i) => `${i.name}×${i.quantity}`).join(", ")}
                      </td>
                      <td>T{order.tableNumber}</td>
                      <td>
                        {new Date(order.arrivalTime).toLocaleString("en-IN", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="amount-cell">₹{order.totalAmount}</td>
                      <td>
                        <span className={getStatusBadgeClass(order.status)}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrderHistory;
