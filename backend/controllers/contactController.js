const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Token = require("../models/tokenModel");
const sendEmail = require("../utils/sendEmail");

const contactUs = asyncHandler(async(req, res) => {
  const { subject, message } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(400);
    throw new Error("User not found, please sign up");
  }

  if (!subject || !message) {
    res.status(400);
    throw new Error("Please add a subject and a message");
  }

  const send_to = process.env.EMAIL_USER;
  const sent_from = process.env.EMAIL_USER;
  const reply_to = user.email;
  const templateId = "d-d0357af7234b4b55ab2d2842b1f2fb7b";
  
  try {
    await sendEmail(
      send_to,
      reply_to,
      sent_from,
      templateId,
      {
        subject: subject,
        message: message
      }
    );
      
    res.status(200).json({
      success: true,
      message: "Feedback Email Sent"
    });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent, please try again");
  }
});

module.exports = {
  contactUs
};