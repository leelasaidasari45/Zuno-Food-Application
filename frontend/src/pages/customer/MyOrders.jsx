// src/pages/customer/MyOrders.jsx
// Customer sees their full order history

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import "./MyOrders.css";

const STATUS_COLORS = {
  pending: "badge-yellow",
  confirmed: "badge-blue",
  preparing: "badge-orange",
  ready: "badge-green",
  completed: "badge-green",
  cancelled: "badge-red",
};

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get("/orders/my");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load orders:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-orders-page">
      <div className="my-orders-container">
        <button
          type="button"
          className="page-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Back to previous page"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Back</span>
        </button>

        <div className="my-orders-header">
          <h1 className="my-orders-title">My Orders</h1>
          <p className="my-orders-subtitle">
            Track all your active and past pre-orders
          </p>
        </div>

        {loading ? (
          <div className="loading-wrapper">
            <div className="spinner"></div>
            <p>Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <h3>No orders yet</h3>
            <p>Pre-order your first meal and skip the waiting queue!</p>
            <Link to="/home" className="btn-primary" style={{ marginTop: "20px", display: "inline-block" }}>
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <Link
                key={order._id}
                to={`/order-status/${order._id}`}
                className="order-history-card"
              >
                <div className="order-card-top">
                  <div className="order-restaurant-info">
                    <span className="order-restaurant-name">
                      {order.restaurant?.name || "Restaurant"}
                    </span>
                    <span className="order-id-tag">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <span className={`badge ${STATUS_COLORS[order.status] || "badge-blue"}`}>
                    {order.status}
                  </span>
                </div>

                <div className="order-items-preview">
                  {order.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
                </div>

                <div className="order-card-bottom">
                  <div className="order-meta-info">
                    <span className="order-meta-item">
                      ⏰ {new Date(order.arrivalTime).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                    </span>
                    <span className="order-meta-item">
                      🪑 Table {order.tableNumber}
                    </span>
                  </div>
                  <div className="order-total-amount">
                    ₹{order.totalAmount}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
