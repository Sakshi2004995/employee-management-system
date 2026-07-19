const Employee = require("../models/Employee");
console.log("EMPLOYEE CONTROLLER LOADED");
console.log(require.resolve("../models/Employee"));

console.log("Employee Model:", Employee);
console.log("findById:", typeof Employee.findById);
console.log("findByIdAndUpdate:", typeof Employee.findByIdAndUpdate);

// ===============================
// Create Employee
// ===============================
exports.createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get All Employees
// Search + Filter + Pagination + Sorting
// ===============================
exports.getAllEmployees = async (req, res) => {
  try {
    // Query Parameters
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";
    const department = req.query.department || "";
    const status = req.query.status || "";
    const sort = req.query.sort || "latest";

    // Filter Object
    let filter = {};

    // Search
    if (search) {
      filter.$or = [
        {
          firstName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          lastName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }
    
    // Department Filter
    if (department) {
      filter.department = department;
    }

    // Status Filter
    if (status) {
      filter.status = status;
    }

    // Sorting
let sortOption = {};

switch (sort) {
  case "salary_asc":
    sortOption = { salary: 1 };
    break;

  case "salary_desc":
    sortOption = { salary: -1 };
    break;

  case "name_asc":
    sortOption = { firstName: 1 };
    break;

  case "name_desc":
    sortOption = { firstName: -1 };
    break;

  case "oldest":
    sortOption = { createdAt: 1 };
    break;

  case "latest":
  default:
    sortOption = { createdAt: -1 };
    break;
}
    

    const totalEmployees = await Employee.countDocuments(filter);

const employees = await Employee.find(filter)
  .sort(sortOption)
  .skip(skip)
  .limit(limit)
  .populate("createdBy", "name email role");

    res.status(200).json({
      success: true,
      totalEmployees,
      currentPage: page,
      totalPages: Math.ceil(totalEmployees / limit),
      employees,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get Employee By ID
// ===============================
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate(
      "createdBy",
      "name email role"
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Update Employee
// ===============================
// ===============================
// Update Employee
// ===============================
exports.updateEmployee = async (req, res) => {
  console.log("========== UPDATE REQUEST ==========");
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    Object.assign(employee, req.body);

    if (req.file) {
      employee.profileImage = `/uploads/profiles/${req.file.filename}`;
    }

    await employee.save();

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Delete Employee
// ===============================
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    await employee.deleteOne();

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ===============================
// Dashboard Statistics
// ===============================
exports.getDashboardStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();

    const activeEmployees = await Employee.countDocuments({
      status: "ACTIVE",
    });

    const inactiveEmployees = await Employee.countDocuments({
      status: "INACTIVE",
    });

    const departments = await Employee.distinct("department");

    const salaryStats = await Employee.aggregate([
      {
        $group: {
          _id: null,
          averageSalary: { $avg: "$salary" },
        },
      },
    ]);

    const averageSalary =
      salaryStats.length > 0
        ? Math.round(salaryStats[0].averageSalary)
        : 0;

    const recentEmployees = await Employee.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("employeeId firstName lastName department salary status");

    res.status(200).json({
      success: true,
      stats: {
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        totalDepartments: departments.length,
        averageSalary,
        recentEmployees,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};