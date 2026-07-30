const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const normalizeEmail = (email) =>
  typeof email === "string" ? email.trim().toLowerCase() : "";

const isBcryptHash = (password) =>
  typeof password === "string" && /^\$2[aby]\$/.test(password);

// =====================================
// Register Business Owner
// =====================================
exports.register = async (req, res) => {
  try {
    const { businessName, fullname, email, password } = req.body;

    if (!businessName || !fullname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const normalizedBusinessName = businessName.trim().toLowerCase();
    const normalizedFullname = fullname.trim();
    const normalizedEmail = normalizeEmail(email);

    const existingBusiness = await User.findOne({
      businessName: normalizedBusinessName,
    });

    if (existingBusiness) {
      return res.status(400).json({
        success: false,
        message: "Business name already exists.",
      });
    }

    const existingEmail = await User.findOne({
      email: normalizedEmail,
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      businessName: normalizedBusinessName,
      fullname: normalizedFullname,
      email: normalizedEmail,
      password: hashedPassword,
      role: "admin",
      createdBy: null,
      mustChangePassword: false,
    });

    res.status(201).json({
      success: true,
      message: "Business account created successfully.",
      user: {
        id: admin._id,
        fullname: admin.fullname,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("========== REGISTER ERROR ==========");
    console.error(error);

    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      const message = duplicateField === "businessName"
        ? "Business name already exists."
        : duplicateField === "email"
        ? "Email already exists."
        : "Duplicate value error.";

      return res.status(400).json({
        success: false,
        message,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Login
// =====================================
exports.login = async (req, res) => {
  try {
    console.log("========== LOGIN REQUEST ==========");

    console.log("Mongo Ready State:", mongoose.connection.readyState);
    console.log("JWT Secret Exists:", !!process.env.JWT_SECRET);

    const email = normalizeEmail(req.body.email);
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    console.log("Searching for:", email);

    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found");

      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    console.log("User Found:", user.email);

    let passwordValid = false;

    if (isBcryptHash(user.password)) {
      passwordValid = await bcrypt.compare(
        password,
        user.password
      );
    } else {
      passwordValid = password === user.password;

      if (passwordValid) {
        user.password = await bcrypt.hash(password, 10);
      }
    }

    console.log("Password Match:", passwordValid);

    if (!passwordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    console.log("Login Successful");

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        businessName: user.businessName,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        active: user.active,
        mustChangePassword: user.mustChangePassword,
      },
    });

  } catch (error) {
    console.error("========== LOGIN ERROR ==========");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};