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
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
// Health Check
// =====================================
app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "✅ API Test Route Working!",
    database:
      mongoose.connection.readyState === 1
        ? "Connected"
        : "Disconnected",
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
  console.error("Global Error:");
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// =====================================
// Start Server
// =====================================
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log("====================================");
    console.log("Starting StockPilot Backend...");
    console.log("Mongo URI Loaded:", !!process.env.MONGO_URI);
    console.log("JWT Secret Loaded:", !!process.env.JWT_SECRET);
    console.log("====================================");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected Successfully");

    app.listen(PORT, () => {
      console.log(`🚀 StockPilot Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("====================================");
    console.error("❌ Failed to connect to MongoDB");
    console.error(error);
    console.error("====================================");

    process.exit(1);
  }
}

startServer();

// =====================================
// MongoDB Events
// =====================================
mongoose.connection.on("connected", () => {
  console.log("📦 MongoDB connection established.");
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected.");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB Error:", err.message);
});

// =====================================
// Graceful Shutdown
// =====================================
process.on("SIGINT", async () => {
  console.log("\nClosing MongoDB connection...");

  await mongoose.connection.close();

  console.log("MongoDB connection closed.");
  process.exit(0);
});