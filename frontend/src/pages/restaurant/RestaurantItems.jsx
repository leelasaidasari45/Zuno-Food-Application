// src/pages/restaurant/RestaurantItems.jsx
// Restaurant admin manages their menu - add, delete, toggle availability

import { useState, useEffect } from "react";
import api from "../../utils/api";
import RestaurantSidebar from "../../components/RestaurantSidebar";
import "./RestaurantItems.css";

const ITEM_CATEGORIES = [
  "Burger", "Pizza", "Biryani", "Noodles", "Dosa", "Idli",
  "Paneer Tikka", "Butter Chicken", "Dal Makhani", "Fried Rice",
  "Coffee", "Ice Cream", "Waffle", "Cake", "Samosa", "Wings", "Other",
];

const RestaurantItems = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // New item form fields
  const [itemName, setItemName] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemCategory, setItemCategory] = useState("Burger");
  const [itemIsVeg, setItemIsVeg] = useState(true);
  const [itemImage, setItemImage] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      const res = await api.get("/menu/my");
      setMenuItems(res.data);
    } catch (err) {
      console.error("Failed to load menu:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add a new menu item
  const handleAddItem = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setAddLoading(true);

    try {
      const res = await api.post("/menu", {
        name: itemName,
        description: itemDesc,
        price: Number(itemPrice),
        category: itemCategory,
        isVeg: itemIsVeg,
        image: itemImage,
      });

      // Add to list without reloading
      setMenuItems((prev) => [...prev, res.data.item]);
      setSuccess("Item added successfully!");

      // Reset form
      setItemName(""); setItemDesc(""); setItemPrice("");
      setItemImage(""); setItemIsVeg(true);
      setShowAddForm(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add item.");
    } finally {
      setAddLoading(false);
    }
  };

  // Toggle item availability
  const handleToggle = async (itemId) => {
    try {
      const res = await api.put(`/menu/${itemId}/toggle`);
      setMenuItems((prev) =>
        prev.map((item) =>
          item._id === itemId ? { ...item, isAvailable: res.data.item.isAvailable } : item
        )
      );
    } catch (err) {
      console.error("Toggle failed:", err.message);
    }
  };

  // Delete an item
  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await api.delete(`/menu/${itemId}`);
      setMenuItems((prev) => prev.filter((item) => item._id !== itemId));
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };

  return (
    <div className="restaurant-layout">
      <RestaurantSidebar />

      <main className="restaurant-main">
        <div className="items-page">
          <div className="page-header">
            <div>
              <h1 className="page-title">Menu Items</h1>
              <p className="page-subtitle">{menuItems.length} items on your menu</p>
            </div>
            <button
              className="btn-primary"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? "✕ Cancel" : "+ Add Item"}
            </button>
          </div>

          {/* ---- Add Item Form Card ---- */}
          {showAddForm && (
            <div className="add-item-card">
              <h3>🍔 Add New Menu Item</h3>

              {error && <div className="error-msg" style={{ marginTop: "16px" }}>{error}</div>}
              {success && <div className="success-msg" style={{ marginTop: "16px" }}>{success}</div>}

              <form className="add-item-form" onSubmit={handleAddItem}>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Item Name *</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="e.g. Classic Cheeseburger"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Price (₹) *</label>
                    <input
                      className="form-input"
                      type="number"
                      min="1"
                      placeholder="e.g. 250"
                      value={itemPrice}
                      onChange={(e) => setItemPrice(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="e.g. Beef patty, cheddar, lettuce, tomato, pickles"
                    value={itemDesc}
                    onChange={(e) => setItemDesc(e.target.value)}
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      className="form-input"
                      value={itemCategory}
                      onChange={(e) => setItemCategory(e.target.value)}
                    >
                      {ITEM_CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Image URL (optional)</label>
                    <input
                      className="form-input"
                      type="url"
                      placeholder="https://..."
                      value={itemImage}
                      onChange={(e) => setItemImage(e.target.value)}
                    />
                  </div>
                </div>

                {/* Veg / Non-Veg toggle */}
                <div className="form-group">
                  <label>Type</label>
                  <div className="veg-toggle-row">
                    <div
                      className={`toggle-option ${itemIsVeg ? "veg-active" : ""}`}
                      onClick={() => setItemIsVeg(true)}
                    >
                      <div className="veg-dot veg"></div>
                      Vegetarian
                    </div>
                    <div
                      className={`toggle-option ${!itemIsVeg ? "nonveg-active" : ""}`}
                      onClick={() => setItemIsVeg(false)}
                    >
                      <div className="veg-dot nonveg"></div>
                      Non-Vegetarian
                    </div>
                  </div>
                </div>

                <button
                  className="add-item-submit-btn"
                  type="submit"
                  disabled={addLoading}
                >
                  {addLoading ? "Adding..." : "Add to Menu"}
                </button>
              </form>
            </div>
          )}

          {/* ---- Menu Items List ---- */}
          {loading ? (
            <div className="loading-wrapper">
              <div className="spinner"></div>
              <p>Loading your menu...</p>
            </div>
          ) : menuItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🍽️</div>
              <h3>No items yet</h3>
              <p>Click "+ Add Item" to add your first menu item</p>
            </div>
          ) : (
            <div className="menu-manage-list">
              {menuItems.map((item) => (
                <div
                  key={item._id}
                  className={`menu-manage-item ${!item.isAvailable ? "unavailable" : ""}`}
                >
                  {/* Image */}
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="menu-manage-img" />
                  ) : (
                    <div className="menu-manage-img-placeholder">🍽️</div>
                  )}

                  {/* Info */}
                  <div className="menu-manage-info">
                    <div className="menu-manage-name">
                      <div className={`veg-dot ${item.isVeg ? "veg" : "nonveg"}`}></div>
                      {item.name}
                    </div>
                    <div className="menu-manage-meta">
                      <span>{item.category}</span>
                      {item.description && <span>• {item.description}</span>}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="menu-manage-price">₹{item.price}</div>

                  {/* Actions */}
                  <div className="menu-manage-actions">
                    {/* Toggle availability */}
                    <button
                      className={`avail-toggle-btn ${item.isAvailable ? "available" : "unavailable-btn"}`}
                      onClick={() => handleToggle(item._id)}
                    >
                      {item.isAvailable ? "● Available" : "● Unavailable"}
                    </button>

                    {/* Delete */}
                    <button
                      className="delete-item-btn"
                      onClick={() => handleDelete(item._id)}
                      title="Delete item"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RestaurantItems;
