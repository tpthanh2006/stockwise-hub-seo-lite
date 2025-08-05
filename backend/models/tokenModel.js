const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: { // can be login or reset token
    type: String,
    default: "",
  },
  vToken: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    required: true,
  },
  expiresAt: {
    type: Date,
    require: true,
  }
});

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;