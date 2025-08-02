const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Log In
const protect = asyncHandler (async(req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, please log in");
    }

    // Verify Token
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(verified.id).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, please log in");
  }
});

// Admin
const adminOnly = asyncHandler (async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an admin")
  };
});

// Staff
const staffOnly = asyncHandler (async (req, res, next) => {
  if (req.user && (req.user.role === "staff" || req.user.role === "admin")) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as a staff")
  };
});

// Verified
const verifiedOnly = asyncHandler (async (req, res, next) => {
  if (req.user && req.user.isVerified) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as a verified user")
  };
});

module.exports = {
  protect,
  adminOnly,
  staffOnly,
  verifiedOnly
};