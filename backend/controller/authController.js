const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ===============================
// Register Business Owner
// ===============================
exports.register = async (req, res) => {
  try {
    const {
      businessName,
      fullname,
      email,
      password,
    } = req.body;

    if (!businessName || !fullname || !email || !password) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    // Check Business Name
    const businessExists = await User.findOne({
      businessName: businessName.trim(),
    });

    if (businessExists) {
      return res.status(400).json({
        message: "Business name already exists.",
      });
    }

    // Check Email
    const emailExists = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (emailExists) {
      return res.status(400).json({
        message: "Email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      businessName: businessName.trim(),
      fullname: fullname.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "admin",
      createdBy: null,
      mustChangePassword: false,
    });

    res.status(201).json({
      message: "Business account created successfully.",
      role: admin.role,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ===============================
// Login
// ===============================
exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password.",
      });
    }

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(400).json({
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

    res.status(200).json({
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
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};