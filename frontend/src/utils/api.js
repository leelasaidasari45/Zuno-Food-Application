// src/utils/api.js
// Central place to make all API calls to the backend
// Using axios which is easier than fetch

import axios from "axios";

// Base URL of our backend - change this if you deploy
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
