// src/App.jsx
// The main app file - sets up all the routes

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Auth
import AuthPage from "./pages/auth/AuthPage";

// Customer Pages
import CustomerHome from "./pages/customer/CustomerHome";
import RestaurantItems from "./pages/customer/RestaurantItems";
import CartPage from "./pages/customer/CartPage";
import ConfirmOrder from "./pages/customer/ConfirmOrder";
import PaymentPage from "./pages/customer/PaymentPage";
import OrderStatus from "./pages/customer/OrderStatus";
import MyOrders from "./pages/customer/MyOrders";
import AboutPage from "./pages/customer/AboutPage";

// Restaurant Pages
import RestaurantSetup from "./pages/restaurant/RestaurantSetup";
import RestaurantHome from "./pages/restaurant/RestaurantHome";
import RestaurantItemsManage from "./pages/restaurant/RestaurantItems";
import OrderHistory from "./pages/restaurant/OrderHistory";
import RestaurantSettings from "./pages/restaurant/RestaurantSettings";

// -----------------------------------------------
// ProtectedRoute - blocks unauthenticated users
// -----------------------------------------------
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();

  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If a specific role is required and user doesn't have it, redirect
  if (allowedRole && user.role !== allowedRole) {
    if (user.role === "restaurant") return <Navigate to="/restaurant/home" replace />;
    return <Navigate to="/home" replace />;
  }

  return children;
};

// -----------------------------------------------
// Main App - wraps everything with providers
// -----------------------------------------------
function App() {
  return (
    // BrowserRouter enables URL-based navigation
    <BrowserRouter>
      {/* AuthProvider makes user info available everywhere */}
      <AuthProvider>
        {/* CartProvider makes cart available everywhere */}
        <CartProvider>
          <Routes>
            {/* ---- Public Route ---- */}
            <Route path="/" element={<AuthPage />} />

            {/* ---- Customer Routes (role = "customer") ---- */}
            <Route
              path="/home"
              element={
                <ProtectedRoute allowedRole="customer">
                  <CustomerHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/restaurant/:restaurantId"
              element={
                <ProtectedRoute allowedRole="customer">
                  <RestaurantItems />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute allowedRole="customer">
                  <CartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/confirm-order"
              element={
                <ProtectedRoute allowedRole="customer">
                  <ConfirmOrder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/:orderId"
              element={
                <ProtectedRoute allowedRole="customer">
                  <PaymentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-status/:orderId"
              element={
                <ProtectedRoute allowedRole="customer">
                  <OrderStatus />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-orders"
              element={
                <ProtectedRoute allowedRole="customer">
                  <MyOrders />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<AboutPage />} />

            {/* ---- Restaurant Routes (role = "restaurant") ---- */}
            <Route
              path="/restaurant/setup"
              element={
                <ProtectedRoute allowedRole="restaurant">
                  <RestaurantSetup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/restaurant/home"
              element={
                <ProtectedRoute allowedRole="restaurant">
                  <RestaurantHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/restaurant/items"
              element={
                <ProtectedRoute allowedRole="restaurant">
                  <RestaurantItemsManage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/restaurant/orders"
              element={
                <ProtectedRoute allowedRole="restaurant">
                  <OrderHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/restaurant/settings"
              element={
                <ProtectedRoute allowedRole="restaurant">
                  <RestaurantSettings />
                </ProtectedRoute>
              }
            />

            {/* Catch-all: redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
