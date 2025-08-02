const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  getUsers,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
  loginWithGoogle,
  loginWithCode,
  sendLoginCode,
  sendCustomEmail,
  sendAutomatedEmail,
  sendVerificationEmail,
  verifyUser,
  deleteUser,
  changeRole,
} = require("../controllers/userController");
const { protect, adminOnly, staffOnly } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

router.get("/loggedin", loginStatus);
router.get("/getuser", protect, getUser);
router.get("/getusers", protect, staffOnly, getUsers);
router.patch("/updateuser", protect, updateUser);
router.post("/changerole", protect, adminOnly, changeRole);

router.patch("/changepassword", protect, changePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);

router.post("/sendLoginCode/:email", sendLoginCode);
router.post("/loginWithCode/:email", loginWithCode);
router.post("/google/callback", loginWithGoogle);

router.post("/sendCustomEmail", sendCustomEmail);
router.post("/sendAutomatedEmail", protect, sendAutomatedEmail);
router.post("/sendverificationemail", protect, sendVerificationEmail);
router.patch("/verifyuser/:verificationToken", protect, verifyUser);
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;