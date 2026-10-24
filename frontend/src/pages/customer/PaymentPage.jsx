// src/pages/customer/PaymentPage.jsx
// Sample payment page - when user clicks Pay, calls backend to confirm order

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { useCart } from "../../context/CartContext";
import "./PaymentPage.css";

const PaymentPage = () => {
  const { orderId } = useParams(); // get order ID from URL
  const navigate = useNavigate();
  const { clearCart, totalPrice } = useCart();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  // Which payment method is selected
  const [payMethod, setPayMethod] = useState("card");

  // Fake card form fields (not real - just for demo)
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Load the order details
  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const res = await api.get(`/orders/${orderId}`);
      setOrder(res.data);
    } catch (err) {
      setError("Could not load order details.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Pay button click
  const handlePay = async () => {
    setPaying(true);
    setError("");

    try {
      // Call backend to mark payment as done and confirm order
      await api.post(`/orders/${orderId}/pay`);

      // Clear the cart since order is placed
      clearCart();

      // Go to order status page
      navigate(`/order-status/${orderId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed. Try again.");
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
        <div className="loading-wrapper">
          <div className="spinner"></div>
          <p>Loading payment details...</p>
        </div>
      </div>
    );
  }

  // Advance amount = 50% of total
  const advanceAmount = order ? (order.advanceAmount).toFixed(0) : 0;

  return (
    <div className="payment-page">
      <div className="payment-content">
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

        <div className="payment-card">
          {/* Amount to pay */}
          <div className="payment-amount-display">
            <div className="pay-label">Advance Payment</div>
            <div className="pay-amount">₹{advanceAmount}</div>
            <div className="pay-note">
              Remaining ₹{order ? (order.totalAmount - order.advanceAmount).toFixed(0) : 0} to be paid at restaurant
            </div>
          </div>

          {/* Order info box */}
          {order && (
            <div className="payment-order-info">
              <div className="info-row">
                <span className="info-label">Restaurant</span>
                <span className="info-value">{order.restaurant?.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Arrival Time</span>
                <span className="info-value">
                  {new Date(order.arrivalTime).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Table</span>
                <span className="info-value">Table {order.tableNumber}</span>
              </div>
            </div>
          )}

          {/* Payment Method Selector */}
          <div className="payment-methods">
            <button
              className={`pay-method-btn ${payMethod === "card" ? "active" : ""}`}
              onClick={() => setPayMethod("card")}
            >
              <span className="method-icon">💳</span>
              Card
            </button>
            <button
              className={`pay-method-btn ${payMethod === "upi" ? "active" : ""}`}
              onClick={() => setPayMethod("upi")}
            >
              <span className="method-icon">📱</span>
              UPI
            </button>
            <button
              className={`pay-method-btn ${payMethod === "netbanking" ? "active" : ""}`}
              onClick={() => setPayMethod("netbanking")}
            >
              <span className="method-icon">🏦</span>
              Net Banking
            </button>
          </div>

          {/* Card Form (fake - for demo only) */}
          {payMethod === "card" && (
            <div className="payment-form">
              <p className="payment-form-heading">Card Details</p>

              <div className="card-input-wrap">
                <span className="card-icon">💳</span>
                <input
                  className="form-input"
                  placeholder="Card Number (e.g. 4242 4242 4242 4242)"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  maxLength="19"
                />
              </div>

              <div className="payment-row">
                <input
                  className="form-input"
                  placeholder="Expiry (MM/YY)"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  maxLength="5"
                />
                <input
                  className="form-input"
                  placeholder="CVV"
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  maxLength="3"
                />
              </div>
            </div>
          )}

          {/* UPI form */}
          {payMethod === "upi" && (
            <div className="payment-form">
              <p className="payment-form-heading">UPI Details</p>
              <input
                className="form-input"
                placeholder="Enter UPI ID (e.g. name@upi)"
              />
            </div>
          )}

          {error && <div className="error-msg" style={{ marginBottom: "16px" }}>{error}</div>}

          {/* Pay Now Button */}
          <button
            className="pay-now-btn"
            onClick={handlePay}
            disabled={paying}
          >
            {paying ? (
              <span className="paying-animation">
                <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div>
                Processing...
              </span>
            ) : (
              `🔒 Pay ₹${advanceAmount} Now`
            )}
          </button>

          {/* Secure note */}
          <div className="secure-note">
            🔒 100% Secure Payment — Demo mode only
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
