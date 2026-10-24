// src/pages/customer/CartPage.jsx
// Shows all items in cart + order summary with advance payment info

import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./CartPage.css";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, cartRestaurantId, addToCart, removeFromCart, totalItems, totalPrice } = useCart();

  // 50% advance amount
  const advanceAmount = totalPrice * 0.5;

  // If cart is empty, show empty state
  if (cart.length === 0) {
    return (
      <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
        <div className="empty-state" style={{ paddingTop: "100px" }}>
          <div className="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "20px" }}>
            <button
              type="button"
              className="page-back-btn"
              onClick={() => navigate(-1)}
              style={{ marginBottom: 0 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back</span>
            </button>
            <Link to="/home" className="btn-primary" style={{ textDecoration: "none" }}>
              Browse Restaurants
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-content">
        {/* ---- LEFT: Cart Items ---- */}
        <div>
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
          <h1 className="cart-heading">Your Cart</h1>
          <p className="cart-restaurant-name">
            {totalItems} item{totalItems > 1 ? "s" : ""} added
          </p>

          {/* List of cart items */}
          {cart.map((item) => (
            <div key={item.menuItem} className="cart-item">
              {/* Item image */}
              {item.image ? (
                <img src={item.image} alt={item.name} className="cart-item-img" />
              ) : (
                <div className="cart-item-img-placeholder">🍽️</div>
              )}

              {/* Item details */}
              <div className="cart-item-details">
                <div className="cart-item-name">
                  <div className={`veg-dot ${item.isVeg ? "veg" : "nonveg"}`}></div>
                  {item.name}
                </div>
                <div className="cart-item-price">₹{item.price} each</div>
              </div>

              {/* Quantity Control */}
              <div className="cart-qty-control">
                <button
                  className="cart-qty-btn"
                  onClick={() => removeFromCart(item.menuItem)}
                >
                  −
                </button>
                <span className="cart-qty-value">{item.quantity}</span>
                <button
                  className="cart-qty-btn"
                  onClick={() => addToCart({ _id: item.menuItem, ...item }, cartRestaurantId)}
                >
                  +
                </button>
              </div>

              {/* Item subtotal */}
              <div className="cart-item-subtotal">₹{item.price * item.quantity}</div>
            </div>
          ))}
        </div>

        {/* ---- RIGHT: Order Summary ---- */}
        <div className="order-summary-card">
          <h3 className="order-summary-title">Order Summary</h3>

          <div className="summary-row">
            <span>Item Total</span>
            <span>₹{totalPrice}</span>
          </div>
          <div className="summary-row">
            <span>Taxes & Charges</span>
            <span>₹0</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>

          {/* Advance payment info box */}
          <div className="summary-advance">
            <div className="advance-title">💳 Pay ₹{advanceAmount.toFixed(0)} now</div>
            <div className="advance-desc">
              50% advance to confirm your order. Remaining ₹{(totalPrice - advanceAmount).toFixed(0)} paid at restaurant.
            </div>
          </div>

          {/* Proceed to Confirm Order */}
          <button
            className="proceed-btn"
            onClick={() => navigate("/confirm-order")}
          >
            Proceed to Confirm →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
