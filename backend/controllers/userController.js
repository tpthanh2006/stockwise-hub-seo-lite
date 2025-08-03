const asyncHandler = require("express-async-handler"); // reduce try-catch blocks
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Cryptr = require("cryptr");
const parser = require("ua-parser-js");
const { OAuth2Client } = require("google-auth-library");

const User = require("../models/userModel");
const Token = require("../models/tokenModel");
const sendEmail = require("../utils/sendEmail");

const cryptr = new Cryptr(process.env.CRYPTR_KEY);
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate Token
const generateToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"});
};

// Hash Token
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token.toString()).digest("hex");
};

// Register User
const registerUser = asyncHandler( async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  // Check if user email already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(404);
    throw new Error("Email has already been registered");
  }

  // Get user agent
  const ua = parser(req.headers['user-agent']);
  const userAgent = ua.ua;

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
    userAgent
  });

  if (user) {
    // Generate Token
    const token = generateToken(user._id);

    // Send HTTP-only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      secure: true
    });

    const { _id, name, email, photo, phone, bio, role, isVerified, userAgent } = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token, 
      role, 
      isVerified,
      userAgent
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Log In User
const loginUser = asyncHandler( async(req, res) => {
  const { email, password } = req.body;
  
  // Validate Request
  if (!email || !password) {
    res.status(400);
    throw new Error("Please add your email and password");
  }

  // Check if user exists in DB
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User not found. Please sign up");
  }

  // Check if password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password);
  
  const ua = parser(req.headers["user-agent"]);
  const thisUserAgent = ua.ua;
  const allowedAgent = user.userAgent.includes(thisUserAgent);
  //console.log(thisUserAgent, allowedAgent);

  // Can't find allowed agents
  if (!allowedAgent) {
    // Generate a 6-digit login code
    const loginCode = Math.floor(100000 + Math.random() * 900000);
    //console.log(loginCode);

    // Encrypt the login code before saving to DB
    const encryptedLoginCode = cryptr.encrypt(loginCode.toString());

    // Delete token if it exists in DB
    let userToken = await Token.findOne({ userId: user._id });
    if (userToken) {
      await userToken.deleteOne();
    };

    // Save token to DB
    await new Token({
      userId: user._id,
      token: encryptedLoginCode,
      createdAt: Date.now(),
      expiresAt: Date.now() + 60 * (60 * 1000) // 60 mins
    }).save();

    res.status(400);
    throw new Error("New device or browser detected.");
  };

  // Generate Token
  const token = generateToken(user._id);

  // Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true
  });

  // Log user in
  if (user && passwordIsCorrect) {
    const { _id, name, email, photo, phone, bio, role, isVerified } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      role,
      isVerified,
      token
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

// Login With Code
const loginWithCode = asyncHandler ( async(req, res) => {
  const { email } = req.params;
  const { loginCode } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  };

  const userToken = await Token.findOne({
    userId: user._id,
    expiresAt: {$gt: Date.now()},
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or expired token. Please log in again");
  };

  const decryptedLoginCode = cryptr.decrypt(userToken.token);
  if (loginCode !== decryptedLoginCode) {
    res.status(400);
    throw new Error("Incorrect login code. Please try again");
  } else {
    // Register new user agent
    const ua = parser(req.headers["user-agent"]);
    const thisUserAgent = ua.ua;
    user.userAgent.push(thisUserAgent);
    await user.save();

    // Remove old token
    await userToken.deleteOne();

    // Send HTTP-only cookie
    const token = generateToken(user._id);
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 86400 * 1000), // 1 DAY
      sameSite: "none",
      secure: true,
    });

    // Log user in
    const { _id, name, email, phone, bio, photo, role, isVerified } = user;
    res.status(201).json({
        _id, name, email, phone, bio, photo, role, isVerified, token
    });
  };
});

// Send Login Code
const sendLoginCode = asyncHandler( async(req, res) => {
  const { email } = req.params;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  };

  // Find login code in DB
  let userToken = await Token.findOne({
    userId: user._id,
    expiresAt: {$gt: Date.now()}
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or expired token. Please log in again");
  };

  const loginCode = userToken.token;
  const decryptedLoginCode = cryptr.decrypt(loginCode);

  // Send Login Code
  const subject = "Login Access Code - Inventory Pilot";
  const send_to = email;
  const sent_from = process.env.EMAIL_USER;
  const reply_to = process.env.EMAIL_USER;
  const name = user.name;
  const link = decryptedLoginCode;
  const templateId = "d-0f9161496c734d238f3fc608aa17db60";

  try {
    await sendEmail(
      send_to,
      sent_from,
      reply_to,
      templateId,
      {
        name: name,
        link: link,
        subject: subject
      }
    );
    
    res.status(200).json({ message: `Access code sent to ${email}` });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent, please try again");
  };
});

// Log Out User
const logoutUser = asyncHandler( async(req, res) => {
  res.cookie("token", "", { // Empty string to modify existed tokens
    path: "/",
    httpOnly: true,
    expires: new Date(0), // Expires the cookie right away
    sameSite: "none",
    secure: true
  });

  return res.status(200).json({
    message: "Log out successfully"
  });
});

// Get User Data
const getUser = asyncHandler( async(req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
      const { _id, name, email, photo, phone, bio, role, isVerified } = user;
      res.status(200).json({
        _id,
        name,
        email,
        photo,
        phone,
        bio,
        role,
        isVerified
      });
  } else {
    res.status(400);
    throw new Error("User not found");    
  }
});

// Get Users
const getUsers = asyncHandler( async(req, res) => {
  const users = await User.find().sort("-createdAt").select("-password");

  if (!users) {
    res.status(500);
    throw new Error("Something went wrong. Please try again")
  };

  res.status(200).json(users);
});

// Get Login Status
const loginStatus = asyncHandler ( async(req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json(false);
  }

  // Verify Token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  }

  return res.json(false);
});

// Update User's Info
const updateUser = asyncHandler ( async(req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { name, email, photo, phone, bio, role, isVerified } = user;

    user.email = email;
    user.bio = req.body.bio || bio;
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;
    user.photo = req.body.photo || photo;
    user.role = req.body.role || role;

    const updatedUser = await user.save();
    res.status(200).json({
      name: updatedUser.name,
      email: updatedUser.email,
      photo: updatedUser.photo,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
      role: updatedUser.role,
      isVerified: updatedUser.isVerified,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Change Password
const changePassword = asyncHandler ( async(req, res) => {
  const user = await User.findById(req.user._id);

  const {oldPassword, password} = req.body;

  // Validate
  if (!user) {
    res.status(400);
    throw new Error("User not found, please sign up");
  }
  if (!oldPassword || !password) {
    res.status(400);
    throw new Error("Please add both old and new password");
  }

  // Check if old password matches in DB
  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

  // Save new password
  if (user && passwordIsCorrect) {
    user.password = password;
    await user.save();
    res.status(200).send("Password changed successful");
  } else {
    res.status(400);
    throw new Error("Old password is incorrect");
  }
});

// Forgot Password
const forgotPassword = asyncHandler ( async(req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new User("User does not exist. Please sign up");
  }

  let token = await Token.findOne({ userId: user._id});
  if (token) {
    await token.deleteOne();
  }

  // Create a Reset Token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  
  // Hash token before saving to DB
  const hashedToken = hashToken(resetToken);
  //console.log(resetToken, hashedToken);

  // Save token to DB
  await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000), // 30' * (60'' * 1000ms)
  }).save();

  // Make a reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  // Reset Email
  const subject = "Reset Your Password - Pilot Inventory";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;
  const reply_to = process.env.EMAIL_USER;
  const name = user.name;
  const link = resetUrl;
  const templateId = "d-cbe79b0799eb46a9b1204bf966d7e309";

  try {
    await sendEmail(
      send_to,
      reply_to,
      sent_from,
      templateId,
      {
        name: name,
        link: link,
        subject: subject
      }
    );
    
    res.status(200).json({
      success: true,
      message: "Reset Email Sent"
    });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent, please try again");
  }

  //res.send("Forgot Password");
});

// Reset Password
const resetPassword = asyncHandler ( async(req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  // Hash token to compare to tokens in DB
  const hashedToken = hashToken(resetToken);

  // Find token in DB
  const userToken = await Token.findOne({
    token: hashedToken,
    expiresAt: {$gt: Date.now()}
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or Expired Token");
  }

  // Find User
  const user = await User.findOne({_id: userToken.userId});
  user.password = password;
  await user.save();

  res.status(200).json({
    message: "Password Reset Successful. Please Login",
  })
});

// Send Verification Email
const sendVerificationEmail = asyncHandler ( async(req, res) => {
  const user = await User.findById(req.user._id);

  // User Validation
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error("User already verified");
  }

  // Delete token if already exists in DB
  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }

  // Create verification token and save
  const verificationToken = crypto.randomBytes(32).toString("hex") + user._id;
  
  // Hash token and save
  const hashedToken = hashToken(verificationToken);
  await new Token({
    userId: user._id,
    vToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 60 * (60 * 1000) // 60 mins
  }).save();

  // Construct verification URL
  const verificationURL = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;

  // Send verification email
  const subject = "Verify Your Account - Pilot Inventory";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;
  const reply_to = process.env.EMAIL_USER;
  const name = user.name;
  const link = verificationURL;
  const templateId = "d-f525938f91294ef19feeda21d8024e7e";

  try {
    await sendEmail(
      send_to,
      reply_to,
      sent_from,
      templateId,
      {
        name: name,
        link: link,
        subject: subject
      }
    );
    
    res.status(200).json({
      success: true,
      message: "Verification Email Sent"
    });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent, please try again");
  }

  //console.log(verificationURL);
  //res.send("Verifcation email");
});

// Send Automated Email
const sendAutomatedEmail = asyncHandler(async (req, res) => {
  const { subject, send_to, reply_to, templateId, url } = req.body;

  if (!subject || !send_to || !reply_to || !templateId) {
    return res.status(400).json({ message: "Missing email parameters" });
  }

  // Get user
  const user = await User.findOne({ email: send_to });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const sent_from = process.env.EMAIL_USER;
  const name = user.name;
  const link = `${process.env.FRONTEND_URL}${url}`;
  
  try {
    await sendEmail(
      send_to,
      sent_from,
      reply_to,
      templateId,
      {
        name: name,
        link: link,
        subject: subject
      }
    );
    
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ message: "Email not sent, please try again" });
  };
});

// Send Custom Email
const sendCustomEmail = asyncHandler(async (req, res) => {
  const { name, email, subject, message, templateId } = req.body;

  if (!subject || !name || !email || !message || !templateId) {
    return res.status(400).json({ message: "Missing email parameters" });
  }

  const sent_from = process.env.EMAIL_USER;
  const send_to = "phuthanhtran26.work@gmail.com";
  const reply_to = email;
  
  try {
    await sendEmail(
      send_to,
      sent_from,
      reply_to,
      templateId,
      {
        name: name,
        email: email,
        subject: subject,
        message: message,
      }
    );
    
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ message: "Email not sent, please try again" });
  };
});

// Verify User
const verifyUser = asyncHandler( async(req, res) => {
  const { verificationToken } = req.params;
  const hashedToken = hashToken(verificationToken);
  const userToken = await Token.findOne({
    vToken: hashedToken,
    expiresAt: {$gt: Date.now()}
  });

  // Token validation
  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or expired token");
  }

  // Find user
  const user = await User.findOne({_id: userToken.userId});

  // User validation
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (user.isVerified) {
    res.status(400);
    throw new Error("User is already verified");
  }

  user.isVerified = true;
  await user.save();
  res.status(200).json({message: "Account verified successful"});

  //res.send('user verifying');
});

// Delete User
const deleteUser = asyncHandler( async(req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found, please sign up.")
  }

  res.status(200).json({
    message: "User deleted successfully"
  });
});

// Change Role
const changeRole = asyncHandler( async(req, res) => {
  const { role, id } = req.body;

  // Find the user by ID
  const user = await User.findById(id);
  
  if (!user) {
    res.status(500);
    throw new Error("User not found");
  };

  user.role = role;
  await user.save();

  res.status(200).json({
    message: `User updated to ${role}`
  });
});

// Login With Google
const loginWithGoogle = asyncHandler ( async (req, res) => {
  const { userToken }  = req.body;
  
  const ticket = await client.verifyIdToken({
    idToken: userToken,
    audience: process.env.GOOGLE_CLIENT_ID
  });

  const payload = ticket.getPayload();
  const { name, email, picture, sub } = payload;
  const password = Date.now() + sub;
  
  // Get user agent
  const ua = parser(req.headers['user-agent']);
  const userAgent = ua.ua;
  
  // Find user in DB
  const user = await User.findOne({ email });

  // Register new user
  if (!user) {  
    const newUser = await User.create({
      name,
      email,
      password,
      userAgent,
      photo: picture,
      isVerified: true
    });

    if (newUser) {
      // Generate Token
      const token = generateToken(newUser._id);

      // Send HTTP-only cookie
      res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true
      });
      
      const { _id, name, email, photo, phone, bio, role, isVerified, userAgent } = newUser;
      res.status(201).json({
        _id,
        name,
        email,
        photo,
        phone,
        bio,
        token, 
        role, 
        isVerified,
        userAgent
      });  
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  };
  
  // Sign old user in
  if (user) {
    // Delete token if it exists in DB
    let oldToken = await Token.findOne({ userId: user._id });
    if (oldToken) {
      await oldToken.deleteOne();
    };

    // Generate Token
    const token = generateToken(user._id);

    // Send HTTP-only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      secure: true,
    });

    const { _id, name, email, phone, bio, photo, role, isVerified } = user;

    res.status(201).json({
      _id,
      name,
      email,
      phone,
      bio,
      photo,
      role,
      isVerified,
      token,
    });
  };
});

module.exports = { 
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
  sendVerificationEmail,
  sendAutomatedEmail,
  sendCustomEmail,
  sendLoginCode,
  loginWithCode,
  loginWithGoogle,
  verifyUser,
  deleteUser,
  changeRole
};