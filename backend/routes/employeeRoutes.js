const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getEmployees,
  addEmployee,
  updateEmployee,
  toggleEmployee,
  deleteEmployee,
} = require("../controller/employeeController");

// ===============================
// Employee Routes
// ===============================

// Get all employees
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getEmployees
);

// Add new employee
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  addEmployee
);

// Update employee
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateEmployee
);

// Activate / Suspend employee
router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  toggleEmployee
);

// Delete employee
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteEmployee
);

module.exports = router;