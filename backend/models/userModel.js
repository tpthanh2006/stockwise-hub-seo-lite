const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add your name"]
  },
  email: {
    type: String,
    required: [true, "Please add your email"],
    unique: true,
    trim: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email"
    ]
  },
  password: {
    type: String,
    required: [true, "Please add your password"],
    minLength: [6, "Password must be at least 6 characters"],
    // maxLenghth: [23, "Password must not be more than 23 characters"]
  },
  photo: {
    type: String,
    required: [true, "Please add your photo"],
    default: "https://cdn-icons-png.flaticon.com/512/8847/8847419.png"
  },
  phone: {
    type: String,
    default: "+1"
  },
  role: {
    type: String,
    required: [true],
    default: "subscriber" // subscriber, admin, staff, suspended
  },
  bio: {
    type: String,
    maxLength: [250, "Bio must not be more than 250 characters"],
    default: ""
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  userAgent: {
    type: Array,
    required: [true],
    default: []
  },
}, {
  timestamps: true,
  minimize: false
});

// Encrypt password before saving to DB
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    return next();
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
})

const User = mongoose.model("User", userSchema);
module.exports = User;