# 🍽️ Zunoindia — Smart Food Pre-Ordering & Table Scheduling Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://zuno-food-application.vercel.app)
[![Backend Status](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://zuno-food-backend.onrender.com)
[![MERN Stack](https://img.shields.io/badge/Stack-MERN-00ED64?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

> **"Food, scheduled for you."**  
> Zunoindia is a full-stack MERN application that redefines the dining experience. It eliminates waiting times by allowing diners to schedule their arrival, reserve tables, and pre-order meals in advance so food is served hot and fresh the moment they walk in.

---

## 🌟 Live Application

- 🌐 **Frontend (Vercel):** [https://zuno-food-application.vercel.app](https://zuno-food-application.vercel.app)
- ⚙️ **Backend API (Render):** [https://zuno-food-application.onrender.com](https://zuno-food-application.onrender.com)
- 📂 **GitHub Repository:** [https://github.com/leelasaidasari45/Zuno-Food-Application](https://github.com/leelasaidasari45/Zuno-Food-Application)

---

## 📌 Problem & Solution

| The Traditional Problem ⏳ | The Zunoindia Solution ✨ |
|---|---|
| Waiting 20–45 minutes for food preparation after being seated. | Food preparation starts before you arrive based on your scheduled time. |
| Uncertainty about restaurant table availability during peak hours. | Pick your table and reserve your slot ahead of time. |
| Restaurant kitchens get overwhelmed by sudden rushes of dine-in orders. | Kitchens receive planned queues, spreading out cooking loads smoothly. |

---

## 🚀 Key Features

### 👤 For Customers
- 🔍 **Explore Restaurants & Menus:** Browse participating restaurants, filter dishes by popular food categories (Biryani, Pizza, Dosa, Burgers, etc.), and view detailed pricing.
- 🕒 **Scheduled Arrival & Pre-Ordering:** Choose your exact dining time and add food to your cart in advance.
- 🛒 **Interactive Cart & Checkout:** Seamless item quantity adjustments, instant subtotal and tax calculation, and special cooking instructions.
- 💳 **Payment & Order Confirmation:** Integrated checkout flow with immediate order confirmation and invoice generation.
- 📍 **Live Order Tracking:** Real-time visual progress tracker across 5 distinct order states:
  `Placed` ➔ `Confirmed` ➔ `Preparing` ➔ `Ready` ➔ `Completed`.
- 🔙 **Effortless Navigation:** Intuitive user journey with one-click back buttons on every page.

### 🏪 For Restaurant Owners
- 📊 **Real-time Order Dashboard:** View incoming orders categorized by current state with customer arrival timestamps.
- ⚡ **One-Click Order State Transitions:** Advance orders through `Confirm`, `Start Preparing`, `Ready for Pickup/Dine-in`, and `Complete`.
- 📋 **Menu & Inventory Control:** Add new dishes with photos, descriptions, categories, and prices. Toggle item availability in one click or remove outdated items.
- ⚙️ **Restaurant Profile Customization:** Set up restaurant banner images, contact information, operating hours, and available table capacity.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** with functional components & hooks
- **Vite** — ultra-fast build tool and dev server
- **React Router v6** — client-side routing with protected route guards
- **Axios** — HTTP client with centralized JWT interceptors & auto-normalizing base URL
- **Lucide React** — modern iconography
- **Pure Modern CSS** — responsive styling, custom animations, and polished UI

### Backend
- **Node.js** & **Express.js** — modular REST API architecture
- **MongoDB Atlas** & **Mongoose ODM** — cloud NoSQL database with schema validation
- **JWT (JSON Web Tokens)** — secure stateless session authentication
- **Bcrypt.js** — salted password hashing
- **CORS & Dotenv** — cross-origin security and environment configuration

### Deployment & DevOps
- **Vercel** — automated frontend continuous deployment with SPA rewrites (`vercel.json`)
- **Render** — cloud containerized hosting for the Node.js backend API
- **GitHub** — version control and CI/CD triggers

---

## 🏗️ Project Architecture

```plaintext
Zuno-Food/
├── backend/
│   ├── config/             # Database connection (MongoDB Atlas)
│   ├── controllers/        # Business logic (auth, restaurants, menus, orders)
│   ├── middleware/         # Auth verification & role-based route guards
│   ├── models/             # Mongoose schemas (User, Restaurant, MenuItem, Order)
│   ├── routes/             # API endpoint definitions
│   ├── .env.example        # Sample environment variables
│   ├── server.js           # Express app entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI (Navbar, ProtectedRoute, etc.)
│   │   ├── context/        # Global state (AuthContext, CartContext)
│   │   ├── pages/          # Customer & Restaurant views
│   │   │   ├── auth/       # Login & Register
│   │   │   ├── customer/   # Home, RestaurantItems, Cart, Checkout, Status
│   │   │   └── restaurant/ # Dashboard, MenuItems, Settings, Setup
│   │   ├── utils/          # Axios instance and API utilities
│   │   └── App.jsx         # App router configuration
│   ├── vercel.json         # Vercel SPA routing rewrite rules
│   ├── vite.config.js      # Vite build configuration
│   └── package.json
│
├── .gitignore              # Multi-level git exclusion list
└── README.md               # Project documentation
```

---

## ⚙️ Local Development Setup

Follow these steps to run Zunoindia locally on your machine:

### 1. Clone the Repository
```bash
git clone https://github.com/leelasaidasari45/Zuno-Food-Application.git
cd Zuno-Food-Application
```

### 2. Configure Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```
Start the backend server:
```bash
npm run dev
```
Backend runs at `http://localhost:5000`.

### 3. Configure Frontend
Open a new terminal window:
```bash
cd frontend
npm install
```
Start the frontend development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000` (or the port shown in your terminal).

---

## 🔒 Security Best Practices Implemented

- Passwords are encrypted using **bcrypt** before saving to the database.
- Private routes are protected with **JSON Web Tokens (JWT)**.
- Role-Based Access Control restricts customer actions from restaurant management functions.
- Environment secrets (`.env`) and `node_modules` are safely ignored from version control.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check the [issues page](https://github.com/leelasaidasari45/Zuno-Food-Application/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Leela Sai Dasari**
- GitHub: [@leelasaidasari45](https://github.com/leelasaidasari45)
- Project: [Zuno-Food-Application](https://github.com/leelasaidasari45/Zuno-Food-Application)
