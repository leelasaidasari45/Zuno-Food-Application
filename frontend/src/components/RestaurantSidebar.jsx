// src/components/RestaurantSidebar.jsx
// The left sidebar shown on all restaurant pages
// Contains navigation links and user info

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./RestaurantSidebar.css";

// Nav items for the restaurant dashboard
const NAV_ITEMS = [
  { path: "/restaurant/home", icon: "🏠", label: "Dashboard" },
  { path: "/restaurant/items", icon: "🍔", label: "Menu Items" },
  { path: "/restaurant/orders", icon: "📋", label: "Order History" },
  { path: "/restaurant/settings", icon: "⚙️", label: "Settings" },
];

const RestaurantSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="restaurant-sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-text">Zuno<span>india</span></div>
        <div className="restaurant-label">Restaurant Panel</div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        {/* Logout */}
        <button className="sidebar-link logout-link" onClick={handleLogout}>
          <span className="nav-icon">🚪</span>
          Logout
        </button>
      </nav>

      {/* User info at bottom */}
      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="sidebar-user-name">{user?.name}</div>
            <div className="sidebar-user-role">Restaurant Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RestaurantSidebar;
