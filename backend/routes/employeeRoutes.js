const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getEmployees,
  addEmployee,
  updateEmployee,
  toggleEmployee,
  deleteEmployee,
} = require("../controller/EmployeeController");

// ===============================
// Employee Routes
// ===============================

// Get all employees
router.get(
  "/",
  protect,
  adminMiddleware,
  getEmployees
);

// Add new employee
router.post(
  "/",
  protect,
  adminMiddleware,
  addEmployee
);

// Update employee
router.put(
  "/:id",
  protect,
  adminMiddleware,
  updateEmployee
);

// Activate / Suspend employee
router.patch(
  "/:id/status",
  protect,
  adminMiddleware,
  toggleEmployee
);

// Delete employee
router.delete(
  "/:id",
  protect,
  adminMiddleware,
  deleteEmployee
);

module.exports = router;