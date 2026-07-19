console.log("EMPLOYEE ROUTES LOADED");
const express = require("express");
const router = express.Router();

const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getDashboardStats,
} = require("../controllers/employeeController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

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
// Dashboard Statistics
// ===============================
router.get(
  "/dashboard/stats",
  protect,
  authorize("SUPER_ADMIN", "HR", "MANAGER"),
  getDashboardStats
);

// ===============================
// Get Employee By ID
// ===============================
router.get(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "HR", "MANAGER"),
  getEmployeeById
);

// ===============================
// Update Employee
// ===============================
router.put(
  "/:id",

  protect,

  authorize("SUPER_ADMIN", "HR"),

  (req, res, next) => {
    console.log("========== BEFORE MULTER ==========");
    next();
  },

  upload.single("profileImage"),

  (req, res, next) => {
    console.log("========== AFTER MULTER ==========");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    next();
  },

  updateEmployee
);

// ===============================
// Delete Employee
// ===============================
router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN"),
  deleteEmployee
);

module.exports = router;