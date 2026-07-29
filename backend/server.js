require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const reportRoutes = require("./routes/reportRoutes");
const productRoutes = require("./routes/productRoutes");
const salesRoutes = require("./routes/salesRoutes");

const app = express();

// ================================
// Middleware
// ================================
app.use(cors());
app.use(express.json());

// ================================
// MongoDB Connection
// ================================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
  });

// ================================
// Test Route
// ================================
app.get("/", (req, res) => {
  res.send("🚀 StockPilot API Running...");
});

// ================================
// API Routes
// ================================

// Authentication
app.use("/api/auth", authRoutes);

// Users
app.use("/api/users", userRoutes);

// Employees
app.use("/api/employees", employeeRoutes);

// Products
app.use("/api/products", productRoutes);

// Sales
app.use("/api/sales", salesRoutes);

// Reports
app.use("/api/reports", reportRoutes);

// ================================
// 404 Handler
// ================================
app.use((req, res) => {
  res.status(404).json({
    message: "API Route Not Found",
  });
});

// ================================
// Start Server
// ================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});