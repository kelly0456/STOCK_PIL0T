const User = require("../models/User");
const bcrypt = require("bcryptjs");

// =======================================
// Get All Employees
// =======================================
exports.getEmployees = async (req, res) => {
  try {

    const employees = await User.find({
      createdBy: req.user.id,
    }).select("-password");

    res.json(employees);

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
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

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        message: "Employee already exists.",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const admin = await User.findById(req.user.id);

    const employee =
      await User.create({

        businessName:
          admin.businessName,

        fullname,

        email,

        phone,

        position,

        password: hashedPassword,

        role: "staff",

        active: true,

        mustChangePassword: true,

        createdBy: req.user.id,

      });

    res.status(201).json({
      message: "Employee created successfully.",
      employee,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};

// =======================================
// Update Employee
// =======================================
exports.updateEmployee = async (req, res) => {

  try {

    const employee =
      await User.findById(req.params.id);

    if (!employee) {

      return res.status(404).json({
        message: "Employee not found.",
      });

    }

    employee.fullname =
      req.body.fullname || employee.fullname;

    employee.email =
      req.body.email || employee.email;

    employee.phone =
      req.body.phone || employee.phone;

    employee.position =
      req.body.position || employee.position;

    await employee.save();

    res.json({
      message: "Employee updated.",
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
    });

  }

};

// =======================================
// Activate / Suspend Employee
// =======================================
exports.toggleEmployee = async (req, res) => {

  try {

    const employee =
      await User.findById(req.params.id);

    if (!employee) {

      return res.status(404).json({
        message: "Employee not found.",
      });

    }

    employee.active = !employee.active;

    await employee.save();

    res.json({
      message: employee.active
        ? "Employee activated."
        : "Employee suspended.",
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
    });

  }

};

// =======================================
// Delete Employee
// =======================================
exports.deleteEmployee = async (req, res) => {

  try {

    await User.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Employee deleted.",
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
    });

  }

};