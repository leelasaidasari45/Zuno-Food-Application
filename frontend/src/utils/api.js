// src/utils/api.js
// Central place to make all API calls to the backend
// Using axios which is easier than fetch

import axios from "axios";

// Base URL of our backend - auto-normalizes whether /api is included or not
let rawUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").trim().replace(/\/+$/, "");
const BASE_URL = rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`;

// Create an axios instance with default settings
const api = axios.create({
  baseURL: BASE_URL,
});

// This "interceptor" automatically adds the JWT token to every request
// So we don't have to add headers manually in every component
api.interceptors.request.use((config) => {
  // Get the token from localStorage
  const token = localStorage.getItem("token");
  if (token) {
    // Add the token in the Authorization header
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
