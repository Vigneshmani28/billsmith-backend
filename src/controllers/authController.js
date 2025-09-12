const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require('bcryptjs')
const crypto = require("crypto");

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.loginUser = async (req, res, next) => {
  const { email, username, password } = req.body;
  try {
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if(!user)  return res.status(400).json({success:false, message: "Invalid Email or Password"});
    if(!user.password)  return res.status(400).json({success:false, message: "Invalid Email or Password"});

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json({success:false, message: "Invalid Email or Password"});

    const token = generateToken(user)
    const { _id, username: uname, email: uemail, name : uName, isConfirmed: uisConfirmed } = user;

    res.status(200).json({success:true, user: { _id, username: uname, email: uemail, name : uName, isConfirmed: uisConfirmed }, token})
    
  } catch (error) {
    next(error)
  }
};

exports.registerUser = async (req, res, next) => {
  const { email, username } = req.body;
  try {

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) return res.status(400).json({ message: "Email or username already exists" });

  const token = crypto.randomBytes(32).toString("hex");

  const user = new User({
    email,
    username,
    confirmationToken: token,
    confirmationTokenExpiry: Date.now() + 24 * 60 * 60 * 1000, // 24h
  });

  await user.save();

  const confirmUrl = `http://localhost:3000/register/confirm/${token}`;
  // await sendEmail(email, "Complete Registration", `Click to complete registration: ${confirmUrl}`);

  res.status(200).json({ message: "Confirmation email sent", url: confirmUrl });
  } catch (error) {
    next(error)
  }
};

exports.confirmRegistration = async (req, res, next) => {
  const { token, name, password, confirmPassword } = req.body;

  try {
    if (!name) {
      return res.status(400).json({success:false, message: "Name is required" });
    }
    
    if (password !== confirmPassword)
    return res.status(400).json({success:false, message: "Passwords do not match" });

  const user = await User.findOne({
    confirmationToken: token,
    confirmationTokenExpiry: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({success:false, message: "Invalid or expired token" });

  user.password = await bcrypt.hash(password, 10);
  user.name = name;
  user.isConfirmed = true;
  user.confirmationToken = undefined;
  user.confirmationTokenExpiry = undefined;

  await user.save();

  res.status(200).json({success:true, message: "Registration complete. You can now login." });
  } catch (error) {
    next(error)
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User with this email does not exist" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 min expiry
    await user.save();

    const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

    console.log(resetUrl)

    res.json({
      success: true,
      message: "Password reset link sent to email",
      url: resetUrl, // helpful for dev mode
    });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    next(err);
  }
};
