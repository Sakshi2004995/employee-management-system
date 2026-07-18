const express = require("express");
const router = express.Router();

const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// ===============================
// Create Employee
// Only SUPER_ADMIN and HR
// ===============================
router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN", "HR"),
  createEmployee
);

// ===============================
// Get All Employees
// SUPER_ADMIN, HR and MANAGER
// ===============================
router.get(
  "/",
  protect,
  authorize("SUPER_ADMIN", "HR", "MANAGER"),
  getAllEmployees
);

// ===============================
// Get Employee By ID
// SUPER_ADMIN, HR and MANAGER
// ===============================
router.get(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "HR", "MANAGER"),
  getEmployeeById
);

// ===============================
// Update Employee
// Only SUPER_ADMIN and HR
// ===============================
router.put(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "HR"),
  updateEmployee
);

// ===============================
// Delete Employee
// Only SUPER_ADMIN
// ===============================
router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN"),
  deleteEmployee
);

module.exports = router;