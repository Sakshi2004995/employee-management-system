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

router.post("/", protect, createEmployee);
router.get("/", protect, getAllEmployees);
router.get("/:id", protect, getEmployeeById);
router.put("/:id", protect, updateEmployee);
router.delete("/:id", protect, deleteEmployee);

module.exports = router;