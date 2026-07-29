const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  getEmployees,
  addEmployee,
  updateEmployee,
  toggleEmployee,
  deleteEmployee,
} = require("../controller/EmployeeController");

// View Employees
router.get("/", auth, admin, getEmployees);

// Add Employee
router.post("/", auth, admin, addEmployee);

// Edit Employee
router.put("/:id", auth, admin, updateEmployee);

// Activate / Suspend
router.patch("/:id/status", auth, admin, toggleEmployee);

// Delete Employee
router.delete("/:id", auth, admin, deleteEmployee);

module.exports = router;