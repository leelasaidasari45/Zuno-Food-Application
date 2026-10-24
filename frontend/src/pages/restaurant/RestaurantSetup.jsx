// src/pages/restaurant/RestaurantSetup.jsx
// First page a restaurant admin sees after registering
// They fill in restaurant details to get started

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import "./RestaurantSetup.css";

// Food categories available to select
const AVAILABLE_CATEGORIES = [
  "Burger", "Pizza", "Biryani", "Noodles", "Dosa", "Idli",
  "Paneer Tikka", "Butter Chicken", "Dal Makhani", "Fried Rice",
  "Coffee", "Ice Cream", "Waffle", "Cake", "Samosa", "Wings",
];

const RestaurantSetup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [numberOfTables, setNumberOfTables] = useState(10);
  const [prepTime, setPrepTime] = useState(15);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Toggle category chip selection
  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat) // remove if already selected
        : [...prev, cat]                 // add if not selected
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedCategories.length === 0) {
      setError("Please select at least one food category.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await api.post("/restaurants/setup", {
        name,
        address,
        phone,
        image,
        description,
        numberOfTables: Number(numberOfTables),
        prepTime: Number(prepTime),
        categories: selectedCategories,
      });

      // Go to dashboard after setup
      navigate("/restaurant/home");
    } catch (err) {
      setError(err.response?.data?.message || "Setup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setup-page-wrapper">
      <div className="setup-card">
        <div className="setup-header">
          <div className="setup-icon">🍳</div>
          <h2>Set Up Your Restaurant</h2>
          <p>Fill in the details to start accepting pre-orders on Zunoindia</p>
        </div>

        {error && <div className="error-msg" style={{ marginBottom: "20px" }}>{error}</div>}

        <form className="setup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Restaurant Name *</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. Burger Barn"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Address *</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. 22 Gachibowli, Hyderabad"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              className="form-input"
              type="tel"
              placeholder="Contact number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Restaurant Banner Image URL</label>
            <input
              className="form-input"
              type="url"
              placeholder="e.g. https://images.unsplash.com/photo-..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
            {image && (
              <div style={{ marginTop: "10px", borderRadius: "10px", overflow: "hidden", border: "1px solid var(--border-light)" }}>
                <img
                  src={image}
                  alt="Restaurant banner preview"
                  style={{ width: "100%", height: "130px", objectFit: "cover", display: "block" }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-input"
              rows="2"
              placeholder="Brief description of your restaurant..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ resize: "vertical" }}
            />
          </div>

          {/* Tables and Prep Time - side by side */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label>Number of Tables</label>
              <input
                className="form-input"
                type="number"
                min="1"
                max="100"
                value={numberOfTables}
                onChange={(e) => setNumberOfTables(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Prep Time (minutes)</label>
              <input
                className="form-input"
                type="number"
                min="5"
                max="120"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
              />
            </div>
          </div>

          {/* Category Chips */}
          <div className="form-group">
            <label>Food Categories (select all that apply)</label>
            <div className="category-chips">
              {AVAILABLE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`category-chip ${selectedCategories.includes(cat) ? "selected" : ""}`}
                  onClick={() => toggleCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <button
            className="setup-submit-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Setting up..." : "🚀 Launch My Restaurant"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestaurantSetup;
