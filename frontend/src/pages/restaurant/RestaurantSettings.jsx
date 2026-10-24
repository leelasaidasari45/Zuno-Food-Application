// src/pages/restaurant/RestaurantSettings.jsx
// Restaurant admin can update their account details and restaurant details

import { useState, useEffect } from "react";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import RestaurantSidebar from "../../components/RestaurantSidebar";
import "./RestaurantSettings.css";

const AVAILABLE_CATEGORIES = [
  "Burger", "Pizza", "Biryani", "Noodles", "Dosa", "Idli",
  "Paneer Tikka", "Butter Chicken", "Dal Makhani", "Fried Rice",
  "Coffee", "Ice Cream", "Waffle", "Cake", "Samosa", "Wings",
];

const RestaurantSettings = () => {
  const { user } = useAuth();

  // Account fields
  const [accountName, setAccountName] = useState("");
  const [accountPhone, setAccountPhone] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [accountLoading, setAccountLoading] = useState(false);
  const [accountMsg, setAccountMsg] = useState({ type: "", text: "" });

  // Restaurant fields
  const [restaurant, setRestaurant] = useState(null);
  const [restName, setRestName] = useState("");
  const [restAddress, setRestAddress] = useState("");
  const [restPhone, setRestPhone] = useState("");
  const [restImage, setRestImage] = useState("");
  const [restDesc, setRestDesc] = useState("");
  const [restTables, setRestTables] = useState(10);
  const [restPrepTime, setRestPrepTime] = useState(15);
  const [restCategories, setRestCategories] = useState([]);
  const [restIsOpen, setRestIsOpen] = useState(true);
  const [restLoading, setRestLoading] = useState(false);
  const [restMsg, setRestMsg] = useState({ type: "", text: "" });

  // Load data on mount
  useEffect(() => {
    if (user) {
      setAccountName(user.name || "");
      setAccountPhone(user.phone || "");
    }
    loadRestaurant();
  }, [user]);

  const loadRestaurant = async () => {
    try {
      const res = await api.get("/restaurants/my/profile");
      const r = res.data;
      setRestaurant(r);
      setRestName(r.name || "");
      setRestAddress(r.address || "");
      setRestPhone(r.phone || "");
      setRestImage(r.image || "");
      setRestDesc(r.description || "");
      setRestTables(r.numberOfTables || 10);
      setRestPrepTime(r.prepTime || 15);
      setRestCategories(r.categories || []);
      setRestIsOpen(r.isOpen);
    } catch (err) {
      console.error("Failed to load restaurant:", err.message);
    }
  };

  // Toggle category in settings
  const toggleCategory = (cat) => {
    setRestCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Save account details
  const handleSaveAccount = async (e) => {
    e.preventDefault();
    setAccountLoading(true);
    setAccountMsg({ type: "", text: "" });

    try {
      await api.put("/auth/update", {
        name: accountName,
        phone: accountPhone,
        ...(accountPassword && { password: accountPassword }),
      });
      setAccountMsg({ type: "success", text: "Account updated successfully!" });
      setAccountPassword("");
    } catch (err) {
      setAccountMsg({ type: "error", text: err.response?.data?.message || "Update failed." });
    } finally {
      setAccountLoading(false);
    }
  };

  // Save restaurant details
  const handleSaveRestaurant = async (e) => {
    e.preventDefault();
    setRestLoading(true);
    setRestMsg({ type: "", text: "" });

    try {
      await api.put("/restaurants/update", {
        name: restName,
        address: restAddress,
        phone: restPhone,
        image: restImage,
        description: restDesc,
        numberOfTables: Number(restTables),
        prepTime: Number(restPrepTime),
        categories: restCategories,
        isOpen: restIsOpen,
      });
      setRestMsg({ type: "success", text: "Restaurant details updated!" });
    } catch (err) {
      setRestMsg({ type: "error", text: err.response?.data?.message || "Update failed." });
    } finally {
      setRestLoading(false);
    }
  };

  return (
    <div className="restaurant-layout">
      <RestaurantSidebar />

      <main className="restaurant-main">
        <div className="settings-page">
          <div className="page-header">
            <div>
              <h1 className="page-title">Settings</h1>
              <p className="page-subtitle">Manage your account and restaurant details</p>
            </div>
          </div>

          <div className="settings-grid">
            {/* Account Details Card */}
            <div className="settings-card">
              <h3>👤 Account Details</h3>

              {accountMsg.text && (
                <div className={accountMsg.type === "success" ? "success-msg" : "error-msg"} style={{ marginBottom: "16px" }}>
                  {accountMsg.text}
                </div>
              )}

              <form className="settings-form" onSubmit={handleSaveAccount}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    className="form-input"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Email (cannot change)</label>
                  <input
                    className="form-input"
                    value={user?.email || ""}
                    disabled
                    style={{ opacity: 0.6, cursor: "not-allowed" }}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    className="form-input"
                    value={accountPhone}
                    onChange={(e) => setAccountPhone(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>New Password (leave blank to keep current)</label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Enter new password"
                    value={accountPassword}
                    onChange={(e) => setAccountPassword(e.target.value)}
                  />
                </div>
                <button className="settings-save-btn" type="submit" disabled={accountLoading}>
                  {accountLoading ? "Saving..." : "Save Account"}
                </button>
              </form>
            </div>

            {/* Restaurant Details Card */}
            <div className="settings-card">
              <h3>🍳 Restaurant Details</h3>

              {restMsg.text && (
                <div className={restMsg.type === "success" ? "success-msg" : "error-msg"} style={{ marginBottom: "16px" }}>
                  {restMsg.text}
                </div>
              )}

              {/* Open/Closed toggle */}
              <div className="open-toggle-row">
                <div>
                  <div className="open-toggle-label">Restaurant Status</div>
                  <div className="open-toggle-desc">
                    {restIsOpen ? "Currently accepting orders" : "Not accepting orders"}
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={restIsOpen}
                    onChange={(e) => setRestIsOpen(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <form className="settings-form" style={{ marginTop: "16px" }} onSubmit={handleSaveRestaurant}>
                <div className="form-group">
                  <label>Restaurant Name</label>
                  <input className="form-input" value={restName} onChange={(e) => setRestName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input className="form-input" value={restAddress} onChange={(e) => setRestAddress(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input className="form-input" value={restPhone} onChange={(e) => setRestPhone(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Restaurant Banner Image URL</label>
                  <input
                    className="form-input"
                    type="url"
                    placeholder="e.g. https://images.unsplash.com/photo-..."
                    value={restImage}
                    onChange={(e) => setRestImage(e.target.value)}
                  />
                  {restImage && (
                    <div style={{ marginTop: "10px", borderRadius: "10px", overflow: "hidden", border: "1px solid var(--border-light)" }}>
                      <img
                        src={restImage}
                        alt="Restaurant banner preview"
                        style={{ width: "100%", height: "130px", objectFit: "cover", display: "block" }}
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    </div>
                  )}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="form-group">
                    <label>Tables</label>
                    <input className="form-input" type="number" value={restTables} onChange={(e) => setRestTables(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Prep Time (min)</label>
                    <input className="form-input" type="number" value={restPrepTime} onChange={(e) => setRestPrepTime(e.target.value)} />
                  </div>
                </div>

                {/* Category chips */}
                <div className="form-group">
                  <label>Categories</label>
                  <div className="category-chips" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                    {AVAILABLE_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        style={{
                          padding: "5px 12px",
                          borderRadius: "999px",
                          border: "2px solid",
                          fontSize: "0.78rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                          borderColor: restCategories.includes(cat) ? "var(--primary)" : "var(--border)",
                          background: restCategories.includes(cat) ? "var(--primary)" : "white",
                          color: restCategories.includes(cat) ? "white" : "var(--text-medium)",
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <button className="settings-save-btn" type="submit" disabled={restLoading}>
                  {restLoading ? "Saving..." : "Save Restaurant"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RestaurantSettings;
