const User = require("../models/user");
const bcrypt = require("bcryptjs");

// =======================================
// Get All Employees
// =======================================
exports.getEmployees = async (req, res) => {
  try {
    const employees = await User.find({
      createdBy: req.user.id,
      role: "staff",
    })
      .select("-password")
      .lean();

    return res.status(200).json({
      success: true,
      employees,
    });
  } catch (error) {
    console.error("GET EMPLOYEES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch employees.",
    });
  }
};

// =======================================
// Add Employee
// =======================================
exports.addEmployee = async (req, res) => {
  try {
    const {
      fullname,
      email,
      phone,
      position,
      password,
    } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email and password are required.",
      });
    }

    const admin = await User.findById(req.user.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin account not found.",
      });
    }

    const existingEmployee = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await User.create({
      businessName: admin.businessName,
      fullname: fullname.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      position: position?.trim() || "",
      password: hashedPassword,
      role: "staff",
      active: true,
      mustChangePassword: true,
      createdBy: admin._id,
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully.",
      employee: {
        id: employee._id,
        fullname: employee.fullname,
        email: employee.email,
        phone: employee.phone,
        position: employee.position,
        role: employee.role,
        active: employee.active,
      },
    });

  } catch (error) {
    console.error("ADD EMPLOYEE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================================
// Update Employee
// =======================================
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await User.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
      role: "staff",
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    if (req.body.email) {
      const existing = await User.findOne({
        email: req.body.email.trim().toLowerCase(),
        _id: { $ne: employee._id },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Email already exists.",
        });
      }
    }

    employee.fullname = req.body.fullname?.trim() || employee.fullname;
    employee.email = req.body.email?.trim().toLowerCase() || employee.email;
    employee.phone = req.body.phone?.trim() || employee.phone;
    employee.position = req.body.position?.trim() || employee.position;

    await employee.save();

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully.",
    });

  } catch (error) {
    console.error("UPDATE EMPLOYEE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================================
// Activate / Suspend Employee
// =======================================
exports.toggleEmployee = async (req, res) => {
  try {
    const employee = await User.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
      role: "staff",
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    employee.active = !employee.active;

    await employee.save();

    return res.status(200).json({
      success: true,
      message: employee.active
        ? "Employee activated successfully."
        : "Employee suspended successfully.",
      active: employee.active,
    });

  } catch (error) {
    console.error("TOGGLE EMPLOYEE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================================
// Delete Employee
// =======================================
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await User.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
      role: "staff",
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    await employee.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully.",
    });

  } catch (error) {
    console.error("DELETE EMPLOYEE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};