// src/pages/auth/AuthPage.jsx
// Redesigned modern, luxury authentication page for Zunoindia
// Supports Sign In & Registration with Customer / Restaurant Partner roles

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import "./AuthPage.css";

const AuthPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Active tab: "login" or "register"
  const [tab, setTab] = useState("login");

  // Selected role for registration: "customer" or "restaurant"
  const [role, setRole] = useState("customer");

  // Form input fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let response;

      if (tab === "register") {
        response = await api.post("/auth/register", {
          name,
          email,
          password,
          role,
          phone,
        });
      } else {
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
      setError(err.response?.data?.message || "Invalid credentials or server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for easy testing
  const handleDemoFill = (demoRole) => {
    setError("");
    setTab("login");
    if (demoRole === "restaurant") {
      setEmail("leelasaidasari@gmail.com");
      setPassword("chinnu");
    } else {
      setEmail("customer@zuno.com");
      setPassword("123456");
    }
  };

  return (
    <div className="zuno-auth-root">
      {/* Ambient background glows */}
      <div className="zuno-glow zuno-glow-1" />
      <div className="zuno-glow zuno-glow-2" />

      <div className="zuno-auth-container">
        
        {/* LEFT HERO SHOWCASE */}
        <div className="zuno-hero-panel">
          <div className="zuno-hero-overlay" />
          
          <div className="zuno-hero-content">
            {/* Top Brand Pill */}
            <div className="zuno-brand-header">
              <div className="zuno-logo-badge">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                  <line x1="6" y1="1" x2="6" y2="4"></line>
                  <line x1="10" y1="1" x2="10" y2="4"></line>
                  <line x1="14" y1="1" x2="14" y2="4"></line>
                </svg>
              </div>
              <span className="zuno-logo-text">Zuno<span>india</span></span>
              <span className="zuno-live-badge">Live Ordering</span>
            </div>

            {/* Headline and Narrative */}
            <div className="zuno-hero-headings">
              <span className="zuno-tag-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                Next-Gen Dining Experience
              </span>
              <h1 className="zuno-hero-title">
                Skip the wait.<br />
                <span className="zuno-highlight">Savor every moment.</span>
              </h1>
              <p className="zuno-hero-desc">
                Reserve your table and pre-order meals in advance. Walk in and enjoy freshly prepared cuisine served the moment you arrive.
              </p>
            </div>

            {/* Interactive Live Status Widget */}
            <div className="zuno-order-ticket-card">
              <div className="ticket-header">
                <div className="ticket-badge">
                  <span className="pulse-dot"></span>
                  Kitchen Live Ticket #084
                </div>
                <span className="ticket-time">Arrival: 1:30 PM</span>
              </div>
              <div className="ticket-body">
                <div className="ticket-item">
                  <span className="item-qty">2×</span>
                  <span className="item-name">Hyderabadi Dum Biryani</span>
                  <span className="item-status">Prepping</span>
                </div>
                <div className="ticket-item">
                  <span className="item-qty">1×</span>
                  <span className="item-name">Butter Naan & Paneer Tikka</span>
                  <span className="item-status">Prepping</span>
                </div>
              </div>
              <div className="ticket-footer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>Zero wait time — Scheduled for Table #04</span>
              </div>
            </div>

            {/* Metrics & Social Proof */}
            <div className="zuno-metrics-row">
              <div className="metric-pill">
                <span className="metric-val">82%</span>
                <span className="metric-lbl">Wait Time Saved</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-pill">
                <span className="metric-val">4.9 ★</span>
                <span className="metric-lbl">Customer Rating</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-pill">
                <span className="metric-val">100+</span>
                <span className="metric-lbl">Partner Kitchens</span>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT AUTH FORM PANEL */}
        <div className="zuno-form-panel">
          <div className="zuno-form-wrapper">
            
            {/* Header Titles */}
            <div className="form-heading-block">
              <h2 className="form-main-title">
                {tab === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="form-sub-title">
                {tab === "login"
                  ? "Enter your credentials to access your scheduled orders"
                  : "Join Zunoindia for effortless pre-ordering and reservation"}
              </p>
            </div>

            {/* Modern Tab Selector */}
            <div className="modern-auth-tabs">
              <button
                type="button"
                className={`modern-tab-btn ${tab === "login" ? "active" : ""}`}
                onClick={() => { setTab("login"); setError(""); }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`modern-tab-btn ${tab === "register" ? "active" : ""}`}
                onClick={() => { setTab("register"); setError(""); }}
              >
                Create Account
              </button>
            </div>

            {/* Role Selection (Only shown when registering) */}
            {tab === "register" && (
              <div className="role-selection-group">
                <label className="field-label-header">I am joining as:</label>
                <div className="role-cards-grid">
                  
                  {/* Customer Card */}
                  <div
                    className={`role-option-card ${role === "customer" ? "active" : ""}`}
                    onClick={() => setRole("customer")}
                  >
                    <div className="role-card-top">
                      <div className="role-icon-box customer-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                      </div>
                      <div className="role-radio-check">
                        {role === "customer" && <div className="radio-inner-dot"></div>}
                      </div>
                    </div>
                    <div className="role-card-title">Food Lover / Diner</div>
                    <div className="role-card-desc">Browse menus, reserve tables & pre-order meals</div>
                  </div>

                  {/* Restaurant Partner Card */}
                  <div
                    className={`role-option-card ${role === "restaurant" ? "active" : ""}`}
                    onClick={() => setRole("restaurant")}
                  >
                    <div className="role-card-top">
                      <div className="role-icon-box restaurant-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
                          <path d="M7 2v20"></path>
                          <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
                        </svg>
                      </div>
                      <div className="role-radio-check">
                        {role === "restaurant" && <div className="radio-inner-dot"></div>}
                      </div>
                    </div>
                    <div className="role-card-title">Restaurant Partner</div>
                    <div className="role-card-desc">Manage table queues, orders & live menus</div>
                  </div>

                </div>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="modern-error-banner">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Interactive Form */}
            <form className="modern-auth-form" onSubmit={handleSubmit}>
              
              {/* Full Name (Registration only) */}
              {tab === "register" && (
                <div className="modern-form-field">
                  <label className="field-label">Full Name</label>
                  <div className="input-with-icon">
                    <span className="input-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </span>
                    <input
                      type="text"
                      className="styled-text-input"
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div className="modern-form-field">
                <label className="field-label">Email Address</label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </span>
                  <input
                    type="email"
                    className="styled-text-input"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Phone (Registration only) */}
              {tab === "register" && (
                <div className="modern-form-field">
                  <label className="field-label">Phone Number (Optional)</label>
                  <div className="input-with-icon">
                    <span className="input-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </span>
                    <input
                      type="tel"
                      className="styled-text-input"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Password with Eye Toggle */}
              <div className="modern-form-field">
                <div className="field-header-row">
                  <label className="field-label">Password</label>
                  {tab === "login" && (
                    <span className="forgot-hint">Secured with JWT</span>
                  )}
                </div>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="styled-text-input has-action"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="gradient-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="submit-loading-state">
                    <span className="btn-spinner"></span>
                    Authenticating...
                  </span>
                ) : (
                  <span className="submit-ready-state">
                    <span>{tab === "login" ? "Sign In to Zunoindia" : "Create My Account"}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </span>
                )}
              </button>

            </form>

            {/* Footer Bottom Switch */}
            <div className="form-footer-switch">
              {tab === "login" ? (
                <p>
                  Don't have an account yet?{" "}
                  <button
                    type="button"
                    className="inline-switch-btn"
                    onClick={() => { setTab("register"); setError(""); }}
                  >
                    Register here
                  </button>
                </p>
              ) : (
                <p>
                  Already registered?{" "}
                  <button
                    type="button"
                    className="inline-switch-btn"
                    onClick={() => { setTab("login"); setError(""); }}
                  >
                    Sign in here
                  </button>
                </p>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
