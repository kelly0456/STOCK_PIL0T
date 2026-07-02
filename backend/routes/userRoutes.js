const express = require("express");
const router = express.Router();

const authController = require("../controller/authController");

// Register
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

// Test Route
router.get("/", (req, res) => {
  res.json({
    message: "User routes working",
  });
});

module.exports = router;