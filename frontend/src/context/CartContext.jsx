// src/context/CartContext.jsx
// Global cart state - any component can add/remove/read items

import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // cart = array of { menuItem, name, price, quantity, isVeg, image, restaurantId }
  const [cart, setCart] = useState([]);
  const [cartRestaurantId, setCartRestaurantId] = useState(null); // track which restaurant the cart is for

  // Add an item to cart (or increase qty if it already exists)
  const addToCart = (item, restaurantId) => {
    // If cart has items from a DIFFERENT restaurant, clear first
    if (cartRestaurantId && cartRestaurantId !== restaurantId) {
      setCart([]);
    }
    setCartRestaurantId(restaurantId);

    setCart((prevCart) => {
      // Check if item already in cart
      const existing = prevCart.find((c) => c.menuItem === item._id);

      if (existing) {
        // Increase quantity by 1
        return prevCart.map((c) =>
          c.menuItem === item._id ? { ...c, quantity: c.quantity + 1 } : c
        );
      } else {
        // Add new item
        return [
          ...prevCart,
          {
            menuItem: item._id,
            name: item.name,
            price: item.price,
            quantity: 1,
            isVeg: item.isVeg,
            image: item.image,
            restaurantId,
          },
        ];
      }
    });
  };

  // Remove one quantity of an item (or remove it if qty becomes 0)
  const removeFromCart = (menuItemId) => {
    setCart((prevCart) => {
      const existing = prevCart.find((c) => c.menuItem === menuItemId);
      if (!existing) return prevCart;

      if (existing.quantity === 1) {
        // Remove item completely
        const updated = prevCart.filter((c) => c.menuItem !== menuItemId);
        if (updated.length === 0) setCartRestaurantId(null);
        return updated;
      } else {
        // Decrease quantity
        return prevCart.map((c) =>
          c.menuItem === menuItemId ? { ...c, quantity: c.quantity - 1 } : c
        );
      }
    });
  };

  // Clear the whole cart (after order is placed)
  const clearCart = () => {
    setCart([]);
    setCartRestaurantId(null);
  };

  // Get total number of items in cart
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Get total price
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartRestaurantId,
        addToCart,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for easy use
export const useCart = () => useContext(CartContext);
