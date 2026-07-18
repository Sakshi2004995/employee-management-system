const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// ===============================
// Register User
// ===============================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    // Generate JWT Token
    const token = generateToken(user._id);

    // Hide password before sending response
    user.password = undefined;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user,
    });

  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Login User
// ===============================
exports.login = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Login API coming in Day 2 🚀",
  });
};