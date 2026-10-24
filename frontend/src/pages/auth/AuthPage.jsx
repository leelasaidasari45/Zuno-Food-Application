// src/pages/auth/AuthPage.jsx
// The combined Login and Register page
// User first picks their role (Customer or Restaurant), then logs in or registers

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import "./AuthPage.css";

const AuthPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Track which tab is active: "login" or "register"
  const [tab, setTab] = useState("login");

  // Track which role the user selected
  const [role, setRole] = useState("customer");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle form submit (works for both login and register)
  const handleSubmit = async (e) => {
    e.preventDefault(); // stop page from refreshing
    setError("");
    setLoading(true);

    try {
      let response;

      if (tab === "register") {
        // Call the register endpoint
        response = await api.post("/auth/register", { name, email, password, role, phone });
      } else {
        // Call the login endpoint
        response = await api.post("/auth/login", { email, password });
      }

      const { token, ...userData } = response.data;

      // Save to context and localStorage
      login(userData, token);

      // Redirect based on role
      if (userData.role === "restaurant") {
        navigate("/restaurant/home");
      } else {
        navigate("/home");
      }
    } catch (err) {
      // Show the error message from the server
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* LEFT - Brand Panel */}
      <div className="auth-left">
        <div className="auth-brand">
          <div className="logo">Zuno<span>india</span></div>
          <p className="tagline">Food, scheduled for you. 🍽️</p>
        </div>

        <div className="auth-features">
          <div className="auth-feature-item">
            <div className="auth-feature-icon">⏰</div>
            <div className="auth-feature-text">
              <h4>Pre-order & Save Time</h4>
              <p>Food ready when you arrive, no waiting</p>
            </div>
          </div>
          <div className="auth-feature-item">
            <div className="auth-feature-icon">📅</div>
            <div className="auth-feature-text">
              <h4>Schedule Your Arrival</h4>
              <p>Pick your table & arrival time in advance</p>
            </div>
          </div>
          <div className="auth-feature-item">
            <div className="auth-feature-icon">🍳</div>
            <div className="auth-feature-text">
              <h4>Restaurant Dashboard</h4>
              <p>Manage orders and kitchen load efficiently</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT - Form Panel */}
      <div className="auth-right">
        <div className="auth-form-wrapper">
          <h2>{tab === "login" ? "Welcome back!" : "Create account"}</h2>
          <p className="auth-subtitle">
            {tab === "login"
              ? "Sign in to your Zunoindia account"
              : "Join Zunoindia today"}
          </p>

          {/* Login / Register Tab Switcher */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${tab === "login" ? "active" : ""}`}
              onClick={() => { setTab("login"); setError(""); }}
            >
              Login
            </button>
            <button
              className={`auth-tab ${tab === "register" ? "active" : ""}`}
              onClick={() => { setTab("register"); setError(""); }}
            >
              Register
            </button>
          </div>

          {/* Role Selection (shown for register tab) */}
          {tab === "register" && (
            <div className="role-selector">
              <button
                className={`role-btn ${role === "customer" ? "active" : ""}`}
                onClick={() => setRole("customer")}
                type="button"
              >
                <span className="role-icon">🧑‍🍽️</span>
                <span className="role-label">Customer</span>
                <span className="role-desc">Browse & order food</span>
              </button>
              <button
                className={`role-btn ${role === "restaurant" ? "active" : ""}`}
                onClick={() => setRole("restaurant")}
                type="button"
              >
                <span className="role-icon">🍳</span>
                <span className="role-label">Restaurant</span>
                <span className="role-desc">Manage your restaurant</span>
              </button>
            </div>
          )}

          {/* Error message */}
          {error && <div className="error-msg">{error}</div>}

          {/* The Form */}
          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Name field - only for register */}
            {tab === "register" && (
              <div className="form-group">
                <label>Full Name</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <input
                className="form-input"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Phone - only for register */}
            {tab === "register" && (
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  className="form-input"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            )}

            <div className="form-group">
              <label>Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              className="btn-primary"
              type="submit"
              disabled={loading}
              style={{ width: "100%", justifyContent: "center", padding: "14px" }}
            >
              {loading
                ? "Please wait..."
                : tab === "login"
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          {/* Switch between login and register */}
          <div className="auth-switch">
            {tab === "login" ? (
              <>Don't have an account?{" "}
                <a onClick={() => { setTab("register"); setError(""); }}>Register here</a>
              </>
            ) : (
              <>Already have an account?{" "}
                <a onClick={() => { setTab("login"); setError(""); }}>Login here</a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
