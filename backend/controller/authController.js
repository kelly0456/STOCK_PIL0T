const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const {
      businessName,
      fullname,
      email,
      password,
    } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "Email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Make the first registered user the admin
    const userCount = await User.countDocuments();

    const user = await User.create({
      businessName,
      fullname,
      email,
      password: hashedPassword,
      role: userCount === 0 ? "admin" : "staff",
    });

    res.status(201).json({
      message: "Account created successfully.",
      role: user.role,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password.",
      });
    }

    if (!user.active) {
      return res.status(403).json({
        message: "Account has been disabled.",
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

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        businessName: user.businessName,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};