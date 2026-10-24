// src/pages/customer/RestaurantItems.jsx
// Shows all menu items for a selected restaurant
// Customer can filter by Veg/Non-Veg and add items to cart

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { useCart } from "../../context/CartContext";
import "./RestaurantItems.css";

const RestaurantItems = () => {
  const { restaurantId } = useParams(); // get restaurant ID from the URL
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, totalItems, totalPrice } = useCart();

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter: "all", "veg", "nonveg"
  const [vegFilter, setVegFilter] = useState("all");

  // Load restaurant details and its menu on page load
  useEffect(() => {
    loadData();
  }, [restaurantId]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Fetch restaurant info and menu in parallel (faster!)
      const [restRes, menuRes] = await Promise.all([
        api.get(`/restaurants/${restaurantId}`),
        api.get(`/menu/restaurant/${restaurantId}`),
      ]);
      setRestaurant(restRes.data);
      setMenuItems(menuRes.data);
    } catch (err) {
      console.error("Failed to load restaurant data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Apply veg filter to menu items
  const filteredItems = menuItems.filter((item) => {
    if (vegFilter === "veg") return item.isVeg === true;
    if (vegFilter === "nonveg") return item.isVeg === false;
    return true; // "all" - show everything
  });

  // Group filtered items by their category
  // e.g. { "Burger": [...items], "Pizza": [...items] }
  const groupedItems = filteredItems.reduce((groups, item) => {
    const cat = item.category;
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(item);
    return groups;
  }, {});

  // Helper: how many of this item is in cart?
  const getItemQtyInCart = (menuItemId) => {
    const found = cart.find((c) => c.menuItem === menuItemId);
    return found ? found.quantity : 0;
  };

  if (loading) {
    return (
      <div className="loading-wrapper" style={{ minHeight: "100vh" }}>
        <div className="spinner"></div>
        <p>Loading menu...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="empty-state" style={{ padding: "100px 20px" }}>
        <div className="empty-icon">😕</div>
        <h3>Restaurant not found</h3>
      </div>
    );
  }

  return (
    <div className="restaurant-items-page">
      {/* ---- Banner Section ---- */}
      <div className="restaurant-banner">
        {restaurant.image ? (
          <img src={restaurant.image} alt={restaurant.name} className="restaurant-banner-img" />
        ) : (
          <div className="restaurant-banner-placeholder">🍽️</div>
        )}

        {/* Dark overlay */}
        <div className="banner-overlay"></div>

        {/* Back button */}
        <button
          type="button"
          className="banner-back-btn"
          onClick={() => navigate(-1)}
          title="Back to previous page"
          aria-label="Back to previous page"
        >
          ←
        </button>

        {/* Restaurant info over banner */}
        <div className="banner-info">
          {restaurant.isOpen && (
            <div className="banner-open-pill">
              <span className="banner-open-dot"></span>
              Open Now
            </div>
          )}
          <h1 className="banner-restaurant-name">{restaurant.name}</h1>
          <div className="banner-meta">
            <span>{restaurant.categories.join("  ·  ")}</span>
            <span>★ {restaurant.rating > 0 ? restaurant.rating.toFixed(1) : "New"}</span>
            <span>⏱ {restaurant.prepTime} min prep</span>
          </div>
          <div className="banner-address">
            <span>📍</span>
            <span>{restaurant.address}</span>
          </div>
        </div>
      </div>

      {/* ---- Menu Section ---- */}
      <div className="menu-section">
        {/* Veg / Non-Veg filter tabs */}
        <div className="veg-filter-bar">
          <button
            className={`veg-filter-btn ${vegFilter === "all" ? "active" : ""}`}
            onClick={() => setVegFilter("all")}
          >
            All
          </button>
          <button
            className={`veg-filter-btn ${vegFilter === "veg" ? "active" : ""}`}
            onClick={() => setVegFilter("veg")}
          >
            <span className="veg-indicator green"></span>
            Veg
          </button>
          <button
            className={`veg-filter-btn ${vegFilter === "nonveg" ? "active" : ""}`}
            onClick={() => setVegFilter("nonveg")}
          >
            <span className="veg-indicator red"></span>
            Non-Veg
          </button>
        </div>

        {/* Check if any items to show */}
        {Object.keys(groupedItems).length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🍽️</div>
            <h3>No items found</h3>
            <p>Try a different filter</p>
          </div>
        ) : (
          /* Loop through each category group */
          Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="menu-category-group">
              <div className="menu-category-title">
                {category}
                <span className="menu-category-count">({items.length})</span>
              </div>

              {/* Loop through items in this category */}
              {items.map((item) => {
                const qtyInCart = getItemQtyInCart(item._id);
                return (
                  <MenuItemCard
                    key={item._id}
                    item={item}
                    qtyInCart={qtyInCart}
                    onAdd={() => addToCart(item, restaurantId)}
                    onRemove={() => removeFromCart(item._id)}
                  />
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* Floating Cart Bar - appears when cart has items */}
      {totalItems > 0 && (
        <Link to="/cart" className="floating-cart-bar">
          <div className="floating-cart-left">
            <span className="floating-cart-count">{totalItems} item{totalItems > 1 ? "s" : ""}</span>
            <span className="floating-cart-label">View cart</span>
          </div>
          <div className="floating-cart-right">
            ₹{totalPrice} →
          </div>
        </Link>
      )}
    </div>
  );
};

// ---- Menu Item Card ---- (a separate small component for each food item)
const MenuItemCard = ({ item, qtyInCart, onAdd, onRemove }) => {
  return (
    <div className={`menu-item-card ${!item.isAvailable ? "unavailable" : ""}`}>
      {/* Left: Item Details */}
      <div className="menu-item-info">
        <div className="menu-item-header">
          {/* Veg / Non-veg dot indicator */}
          <div className={`veg-dot ${item.isVeg ? "veg" : "nonveg"}`}></div>
          <span className="menu-item-name">{item.name}</span>
          {!item.isAvailable && (
            <span className="badge badge-red" style={{ fontSize: "0.7rem" }}>Unavailable</span>
          )}
        </div>

        <p className="menu-item-desc">{item.description}</p>

        <div className="menu-item-footer">
          <span className="menu-item-price">₹{item.price}</span>
          <span className="serves-tag">👤 Serves 1</span>
        </div>
      </div>

      {/* Right: Image + Add button */}
      <div className="menu-item-image-box">
        {item.image ? (
          <img src={item.image} alt={item.name} className="menu-item-img" />
        ) : (
          <div className="menu-item-img-placeholder">🍽️</div>
        )}

        {/* Show Add button OR quantity counter */}
        {item.isAvailable && (
          <div className="add-btn-wrap">
            {qtyInCart === 0 ? (
              <button className="add-btn" onClick={onAdd}>ADD</button>
            ) : (
              <div className="qty-counter">
                <button className="qty-counter-btn" onClick={onRemove}>−</button>
                <span className="qty-counter-value">{qtyInCart}</span>
                <button className="qty-counter-btn" onClick={onAdd}>+</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantItems;
