const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

// =====================
// 🔹 Protect Middleware (Admin Only)
// =====================
const protect = async (req, res, next) => {
  let token;

  // Read from Authorization Header (Bearer token)
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_jwt_secret");
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized as admin" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

// =====================
// 🔹 Check Authentication (Admin Only)
// =====================
router.get("/check-auth", protect, async (req, res) => {
  res.json({
    isAuthenticated: true,
    isAdmin: req.user.isAdmin,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
});

// =====================
// 🔹 Registration
// =====================
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const name = `${firstName} ${lastName}`.trim();

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({
      name,
      email,
      password,
      isAdmin: false, // default = not admin
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

// =====================
// 🔹 Login (Admin Only)
// =====================
router.post("/login", async (req, res) => {
  const { email, password, rememberMe } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.isAdmin) {
      return res
        .status(400)
        .json({ message: "Invalid email or password, or not an admin" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "default_jwt_secret",
      {
        expiresIn: rememberMe ? "30d" : "1h",
      }
    );

    res.json({
      message: "Logged in successfully",
      token, // frontend stores in localStorage
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// =====================
// 🔹 Logout (Frontend clears localStorage)
// =====================
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

// =====================
// 🔹 Admin-only Routes
// =====================
router.get("/all", protect, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

router.delete("/:id", protect, async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

router.get("/:id", protect, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

module.exports = router;
