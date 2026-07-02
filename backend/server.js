require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Routes
app.get("/", (req, res) => {
  res.send("Stock Pilot API Running");
});

// Authentication Routes
app.use("/api/auth", authRoutes);

// User Management Routes
app.use("/api/users", userRoutes);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});