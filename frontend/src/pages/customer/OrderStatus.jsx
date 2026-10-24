// src/pages/customer/OrderStatus.jsx
// Shows the current status of an order with an animated timeline

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import "./OrderStatus.css";

// Define the stages in order
const STATUS_STEPS = [
  {
    key: "pending",
    label: "Order Placed",
    desc: "Your order has been sent to the restaurant",
    icon: "📝",
  },
  {
    key: "confirmed",
    label: "Order Confirmed",
    desc: "Payment received, restaurant acknowledged your order",
    icon: "✅",
  },
  {
    key: "preparing",
    label: "Preparing",
    desc: "Chef is preparing your food",
    icon: "🍳",
  },
  {
    key: "ready",
    label: "Ready!",
    desc: "Your food is ready and waiting for you",
    icon: "🎉",
  },
];

// Helper: which step number is this status?
const getStepIndex = (status) => {
  const map = { pending: 0, confirmed: 1, preparing: 2, ready: 3, completed: 3 };
  return map[status] ?? 0;
};

const OrderStatus = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();

    // Auto-refresh every 30 seconds to get latest status
    const interval = setInterval(loadOrder, 30000);
    return () => clearInterval(interval); // cleanup on unmount
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const res = await api.get(`/orders/${orderId}`);
      setOrder(res.data);
    } catch (err) {
      console.error("Failed to load order:", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
        <div className="loading-wrapper">
          <div className="spinner"></div>
          <p>Loading order status...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
        <div className="empty-state" style={{ paddingTop: "100px" }}>
          <div className="empty-icon">😕</div>
          <h3>Order not found</h3>
        </div>
      </div>
    );
  }

  const currentStepIndex = getStepIndex(order.status);

  return (
    <div className="order-status-page">
      <div className="order-status-content">
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

        {/* Success Banner */}
        <div className="order-confirmed-banner">
          <div className="confirmed-icon">🎊</div>
          <h2 className="confirmed-title">Order Confirmed!</h2>
          <p className="confirmed-subtitle">
            Your food will be ready when you arrive. No waiting!
          </p>
          <div className="order-id-chip">
            Order #{orderId.slice(-8).toUpperCase()}
          </div>
        </div>

        {/* Status Timeline Card */}
        <div className="status-timeline-card">
          <h3>🚦 Order Status</h3>

          <div className="timeline">
            {STATUS_STEPS.map((step, index) => {
              // Determine if this step is done, active, or future
              let state = "future";
              if (index < currentStepIndex) state = "done";
              else if (index === currentStepIndex) state = "active";

              return (
                <div key={step.key} className={`timeline-step ${state}`}>
                  <div className="step-icon">
                    {state === "done" ? "✓" : step.icon}
                  </div>
                  <div className="step-content">
                    <div className="step-label">{step.label}</div>
                    <div className="step-desc">{step.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details */}
        <div className="order-details-card">
          <h3>🧾 Order Details</h3>
          <div className="order-detail-row">
            <span className="order-detail-label">Restaurant</span>
            <span className="order-detail-value">{order.restaurant?.name}</span>
          </div>
          <div className="order-detail-row">
            <span className="order-detail-label">Arrival Time</span>
            <span className="order-detail-value">
              {new Date(order.arrivalTime).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          </div>
          <div className="order-detail-row">
            <span className="order-detail-label">Table</span>
            <span className="order-detail-value">Table {order.tableNumber}</span>
          </div>
          <div className="order-detail-row">
            <span className="order-detail-label">Items</span>
            <span className="order-detail-value">
              {order.items.map((i) => `${i.name} x${i.quantity}`).join(", ")}
            </span>
          </div>
          <div className="order-detail-row">
            <span className="order-detail-label">Total Amount</span>
            <span className="order-detail-value">₹{order.totalAmount}</span>
          </div>
          <div className="order-detail-row">
            <span className="order-detail-label">Advance Paid</span>
            <span className="order-detail-value" style={{ color: "var(--green)" }}>
              ₹{order.advanceAmount} ✓
            </span>
          </div>
        </div>

        {/* Back to Home */}
        <Link to="/home" className="back-home-btn">
          🏠 Back to Home
        </Link>
      </div>
    </div>
  );
};

export default OrderStatus;
