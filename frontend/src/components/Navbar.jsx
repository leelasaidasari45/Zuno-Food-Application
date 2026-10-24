// src/components/Navbar.jsx
// Top navigation bar shown on all customer pages - Redesigned UI

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Controls whether the user dropdown is open
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle logout click
  const handleLogout = () => {
    setShowDropdown(false);
    logout();
    navigate("/");
  };

  // Get first letter of user's name for the avatar
  const avatarLetter = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="zuno-navbar-wrapper">
      <nav className="zuno-navbar">
        <div className="navbar-container">
          {/* Left Side: Logo & Location */}
          <div className="navbar-brand-group">
            <Link to="/home" className="brand-logo" aria-label="Zunoindia Home">
              <div className="brand-icon-box">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                  <line x1="6" y1="1" x2="6" y2="4"></line>
                  <line x1="10" y1="1" x2="10" y2="4"></line>
                  <line x1="14" y1="1" x2="14" y2="4"></line>
                </svg>
              </div>
              <div className="brand-text">
                <span className="brand-main">Zuno</span>
                <span className="brand-suffix">india</span>
              </div>
            </Link>
          </div>

          {/* Center Links (Quick Nav) */}
          <div className="navbar-center-nav">
            <Link
              to="/home"
              className={`nav-link-item ${location.pathname === "/home" ? "active" : ""}`}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span>Restaurants</span>
            </Link>
            <Link
              to="/my-orders"
              className={`nav-link-item ${location.pathname === "/my-orders" ? "active" : ""}`}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span>My Orders</span>
            </Link>
          </div>

          {/* Right Side: Cart + User Profile */}
          <div className="navbar-actions">
            {/* Cart Button */}
            <Link
              to="/cart"
              className={`premium-cart-btn ${totalItems > 0 ? "has-items" : ""}`}
              aria-label="Shopping Cart"
            >
              <div className="cart-icon-wrapper">
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {totalItems > 0 && (
                  <span className="cart-badge-count animate-pop">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="cart-label">Cart</span>
            </Link>

            {/* User Profile Menu */}
            <div className="user-profile-wrapper" ref={dropdownRef}>
              <button
                className={`profile-trigger-btn ${showDropdown ? "active" : ""}`}
                onClick={() => setShowDropdown((prev) => !prev)}
                aria-expanded={showDropdown}
                aria-label="User Account Menu"
              >
                <div className="avatar-disc">
                  {avatarLetter}
                </div>
                <div className="profile-name-snippet">
                  <span className="user-greeting">Hi,</span>
                  <span className="user-firstname">{user?.name ? user.name.split(" ")[0] : "Guest"}</span>
                </div>
                <svg
                  className={`chevron-icon ${showDropdown ? "rotate" : ""}`}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {/* Redesigned Floating Profile Dropdown */}
              {showDropdown && (
                <div className="profile-dropdown-card">
                  <div className="dropdown-profile-header">
                    <div className="dropdown-avatar-large">
                      {avatarLetter}
                    </div>
                    <div className="dropdown-user-text">
                      <h4 className="dropdown-user-name">{user?.name || "User"}</h4>
                      <p className="dropdown-user-email">{user?.email || ""}</p>
                      <span className="dropdown-role-chip">
                        {user?.role === "customer" ? "🍽️ Customer" : "🏪 Restaurant Admin"}
                      </span>
                    </div>
                  </div>

                  <div className="dropdown-menu-list">
                    <Link
                      to="/home"
                      className="menu-option-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      <div className="option-icon-box">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        </svg>
                      </div>
                      <span>Explore Food</span>
                    </Link>

                    <Link
                      to="/my-orders"
                      className="menu-option-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      <div className="option-icon-box">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                      </div>
                      <span>My Pre-Orders</span>
                    </Link>

                    <Link
                      to="/cart"
                      className="menu-option-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      <div className="option-icon-box">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="9" cy="21" r="1"></circle>
                          <circle cx="20" cy="21" r="1"></circle>
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                      </div>
                      <span>My Cart {totalItems > 0 && `(${totalItems})`}</span>
                    </Link>
                  </div>

                  <div className="dropdown-footer">
                    <button
                      className="logout-option-btn"
                      onClick={handleLogout}
                      type="button"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
