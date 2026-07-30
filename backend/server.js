require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const productRoutes = require("./routes/productRoutes");
const salesRoutes = require("./routes/salesRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// =====================================
// Middleware
// =====================================
app.use(cors());
app.use(express.json());

// =====================================
// MongoDB Connection
// =====================================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });

// =====================================
// Home Route
// =====================================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 StockPilot API Running...",
  });
});

// =====================================
// TEST ROUTE
// =====================================
app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "✅ API Test Route Working!",
  });
});

// =====================================
// API Routes
// =====================================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/reports", reportRoutes);

// =====================================
// 404 Route
// =====================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found",
  });
});

// =====================================
// Global Error Handler
// =====================================
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// =====================================
// Start Server
// =====================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 StockPilot Server running on port ${PORT}`);
});