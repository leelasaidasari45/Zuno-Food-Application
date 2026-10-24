// src/pages/customer/CustomerHome.jsx
// Customer home page - shows all restaurants with category filter

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../utils/api";
import "./CustomerHome.css";

// Food category list - image URL + name pairs for the category circles
// You can replace any of these URLs with your own custom image URLs
const FOOD_CATEGORIES = [
  {
    name: "All",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Idli",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Dosa",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Biryani",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Burger",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Noodles",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Coffee",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Cake",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Samosa",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Butter Chicken",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Paneer Tikka",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Ice Cream",
    image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Fried Rice",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Wings",
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Waffle",
    image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Dal Makhani",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&auto=format&fit=crop&q=80",
  },
];

const CustomerHome = () => {
  const [restaurants, setRestaurants] = useState([]); // all loaded restaurants
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchText, setSearchText] = useState("");

  // Load restaurants from backend when component mounts
  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const res = await api.get("/restaurants");
      setRestaurants(res.data);
    } catch (err) {
      console.error("Failed to load restaurants:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // When a category is clicked, filter restaurants
  const handleCategoryClick = async (categoryName) => {
    setSelectedCategory(categoryName);
    try {
      setLoading(true);
      // Pass category as query param - backend filters with $in
      const res = await api.get(`/restaurants?category=${categoryName}`);
      setRestaurants(res.data);
    } catch (err) {
      console.error("Failed to filter:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Client-side search filter on top of the already fetched list
  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchText.toLowerCase()) ||
    r.address.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="home-page">
      <Navbar />

      {/* Hero Section - Centered layout with search below text */}
      <div className="hero-section">
        <div className="hero-inner">
          <div className="hero-badge">
            <span className="hero-badge-icon">⚡</span>
            <span>Zero Waiting Time Dine-In</span>
          </div>

          <div className="hero-text">
            <h1>
              Order ahead, arrive <span>on time.</span>
            </h1>
            <p>
              Pre-order your favorite meal and skip the waiting queue. Food hot and ready the moment you walk in.
            </p>
          </div>

          {/* Search bar centered directly down of the text */}
          <div className="hero-search-wrapper">
            <div className="search-bar">
              <svg
                className="search-svg-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Search for restaurants, cuisines, or dishes..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              {searchText && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchText("")}
                  title="Clear search"
                  aria-label="Clear search input"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Circles Section */}
      <div className="category-section">
        <h2>What are you craving?</h2>
        <div className="categories-row">
          {FOOD_CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className={`category-item ${selectedCategory === cat.name ? "active" : ""}`}
              onClick={() => handleCategoryClick(cat.name)}
            >
              <div className="category-circle">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to placeholder if an image URL fails to load
                    e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop&q=80";
                  }}
                />
              </div>
              <span className="category-name">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Restaurants Section */}
      <div className="restaurants-section">
        <div className="restaurants-header">
          <h2>
            {selectedCategory === "All"
              ? "All Restaurants"
              : `${selectedCategory} Restaurants`}
          </h2>
          {!loading && (
            <span className="restaurants-count">
              {filteredRestaurants.length} found
            </span>
          )}
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="loading-wrapper">
            <div className="spinner"></div>
            <p>Finding restaurants near you...</p>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          /* Empty state */
          <div className="empty-state">
            <div className="empty-icon">🍽️</div>
            <h3>No restaurants found</h3>
            <p>Try a different category or search term</p>
          </div>
        ) : (
          /* Restaurant Grid */
          <div className="restaurants-grid">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ---- Restaurant Card Component ----
// Separate small component to keep the code clean
const RestaurantCard = ({ restaurant }) => {
  return (
    <Link to={`/restaurant/${restaurant._id}`} className="restaurant-card">
      {/* Restaurant Image */}
      {restaurant.image ? (
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="restaurant-card-img"
        />
      ) : (
        <div className="restaurant-img-placeholder">🍽️</div>
      )}

      <div className="restaurant-card-body">
        <div className="restaurant-card-header">
          <h3 className="restaurant-name">{restaurant.name}</h3>
          <span className={`open-badge ${restaurant.isOpen ? "open" : "closed"}`}>
            {restaurant.isOpen ? "● Open" : "● Closed"}
          </span>
        </div>

        {/* Category tags */}
        <div className="restaurant-tags">
          {restaurant.categories.slice(0, 3).map((cat) => (
            <span key={cat} className="restaurant-tag">{cat}</span>
          ))}
        </div>

        {/* Rating, prep time */}
        <div className="restaurant-meta">
          <div className="meta-item">
            <span className="star">★</span>
            <span>{restaurant.rating > 0 ? restaurant.rating.toFixed(1) : "New"}</span>
          </div>
          <div className="meta-item">
            <span>⏱</span>
            <span>{restaurant.prepTime} min prep</span>
          </div>
        </div>

        {/* Address */}
        <div className="restaurant-address">
          <span>📍</span>
          <span>{restaurant.address}</span>
        </div>
      </div>
    </Link>
  );
};

export default CustomerHome;
