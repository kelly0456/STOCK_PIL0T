const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ===============================
// Register Business Owner (Admin)
// ===============================
exports.register = async (req, res) => {
  try {
    const {
      businessName,
      fullname,
      email,
      password,
    } = req.body;

    // Only allow one public registration
    const adminExists = await User.findOne({ role: "admin" });

    if (adminExists) {
      return res.status(403).json({
        message: "Business account already exists. Please login.",
      });
    }

    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res.status(400).json({
        message: "Email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      businessName,
      fullname,
      email,
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
    console.log(error);

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

  const user = await User.findOne({
  email: email.toLowerCase().trim(),
});

console.log("========== LOGIN DEBUG ==========");
console.log("Email entered:", email);
console.log("User found:", user);

if (!user) {
  return res.status(400).json({
    message: "Invalid email or password.",
  });
}

const match = await bcrypt.compare(password, user.password);

console.log("Password entered:", password);
console.log("Hash in DB:", user.password);
console.log("Password Match:", match);

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

    res.json({
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
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};