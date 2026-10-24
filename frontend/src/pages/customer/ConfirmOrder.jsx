// src/pages/customer/ConfirmOrder.jsx
// Customer selects arrival time and table, then places the order

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import "./ConfirmOrder.css";

const ConfirmOrder = () => {
  const navigate = useNavigate();
  const { cart, cartRestaurantId, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const [restaurant, setRestaurant] = useState(null);
  const [arrivalTime, setArrivalTime] = useState("");
  const [selectedTable, setSelectedTable] = useState(null);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load restaurant info (to know how many tables are available)
  useEffect(() => {
    if (!cartRestaurantId) {
      navigate("/home"); // if no cart, go home
      return;
    }
    loadRestaurant();
  }, [cartRestaurantId]);

  const loadRestaurant = async () => {
    try {
      const res = await api.get(`/restaurants/${cartRestaurantId}`);
      setRestaurant(res.data);
    } catch (err) {
      console.error("Failed to load restaurant:", err.message);
    }
  };

  // Get the minimum datetime (at least 30 minutes from now)
  const getMinTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return now.toISOString().slice(0, 16); // format: "2024-01-01T12:00"
  };

  // Handle Place Order
  const handlePlaceOrder = async () => {
    if (!arrivalTime) {
      setError("Please select your arrival time");
      return;
    }
    if (!selectedTable) {
      setError("Please select a table");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Format items for the API
      const orderItems = cart.map((item) => ({
        menuItemId: item.menuItem,
        quantity: item.quantity,
      }));

      // Place the order
      const res = await api.post("/orders", {
        restaurantId: cartRestaurantId,
        items: orderItems,
        tableNumber: selectedTable,
        arrivalTime,
        specialInstructions,
      });

      // Navigate to payment page with the new order ID
      navigate(`/payment/${res.data.order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const advanceAmount = (totalPrice * 0.5).toFixed(0);

  // Number of tables from restaurant (default 10)
  const totalTables = restaurant?.numberOfTables || 10;

  return (
    <div className="confirm-page">
      <div className="confirm-content">
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

        <h1 className="confirm-heading">Confirm Your Order</h1>
        <p className="confirm-subtitle">Choose your arrival time and table before proceeding to payment.</p>

        <div className="confirm-grid">
          {/* ---- LEFT: Form ---- */}
          <div>
            <div className="confirm-form-card">
              <h3>📅 Schedule Your Visit</h3>

              {error && <div className="error-msg" style={{ marginBottom: "16px" }}>{error}</div>}

              <div className="confirm-form">
                {/* Arrival Time picker */}
                <div className="form-group">
                  <label>Arrival Time</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    min={getMinTime()}
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                  />
                  <small style={{ color: "var(--text-light)", fontSize: "0.78rem" }}>
                    Minimum 30 minutes from now
                  </small>
                </div>

                {/* Table Selection */}
                <div className="form-group">
                  <label>Select Table</label>
                  <div className="table-grid">
                    {Array.from({ length: totalTables }, (_, i) => i + 1).map((tableNum) => (
                      <button
                        key={tableNum}
                        className={`table-btn ${selectedTable === tableNum ? "selected" : ""}`}
                        onClick={() => setSelectedTable(tableNum)}
                        type="button"
                      >
                        T{tableNum}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Special Instructions */}
                <div className="form-group">
                  <label>Special Instructions (optional)</label>
                  <textarea
                    className="form-input"
                    rows="3"
                    placeholder="E.g. No spicy, extra sauce, allergies..."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    style={{ resize: "vertical" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ---- RIGHT: Order Summary ---- */}
          <div className="confirm-summary-card">
            <h3>🧾 Order Summary</h3>

            {/* List all cart items */}
            {cart.map((item) => (
              <div key={item.menuItem} className="confirm-item-row">
                <span className="confirm-item-name">{item.name}</span>
                <span className="confirm-item-qty">x{item.quantity}</span>
                <span className="confirm-item-price">₹{item.price * item.quantity}</span>
              </div>
            ))}

            <div className="confirm-total-row">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>

            {/* Advance info */}
            <div className="confirm-advance-box">
              Pay ₹{advanceAmount} advance now
            </div>

            {/* Show selected details */}
            {arrivalTime && (
              <div style={{ fontSize: "0.8rem", color: "var(--text-light)", marginTop: "12px" }}>
                📅 {new Date(arrivalTime).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
              </div>
            )}
            {selectedTable && (
              <div style={{ fontSize: "0.8rem", color: "var(--text-light)", marginTop: "4px" }}>
                🪑 Table {selectedTable}
              </div>
            )}

            {/* Proceed to Payment button */}
            <button
              className="confirm-pay-btn"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? "Placing Order..." : `Proceed to Pay ₹${advanceAmount} →`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrder;
