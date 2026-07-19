const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

const app = express();

// ===============================
// Middlewares
// ===============================
app.use(express.json());
app.use((req, res, next) => {
  console.log("CONTENT-TYPE:", req.headers["content-type"]);
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());

// ===============================
// Static Folder for Uploaded Images
// ===============================
app.use("/uploads", express.static("uploads"));

// ===============================
// Rate Limiter
// ===============================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

// ===============================
// Routes
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);

// ===============================
// Test Route
// ===============================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Employee Management API Running 🚀",
  });
});

module.exports = app;