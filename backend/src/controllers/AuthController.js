import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body || {};

  const normalizedFullName = fullName?.trim();
  const normalizedEmail = email?.trim().toLowerCase();
  const sanitizedPassword = password?.trim();

  try {
    if (!normalizedFullName || !normalizedEmail || !sanitizedPassword) {
      return res.status(400).json({
        message: "Full name, email, and password are required"
      });
    }

    if (sanitizedPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Invalid email format"
      });
    }

    const emailInUse = await User.exists({ email: normalizedEmail });
    if (emailInUse) {
      return res.status(409).json({
        message: "Email already in use"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(sanitizedPassword, salt);

    const createdUser = await User.create({
      fullName: normalizedFullName,
      email: normalizedEmail,
      password: hashedPassword
    });

    // Persist user before issuing token to avoid stale references
    generateToken(createdUser._id, res);

    try{
      await sendWelcomeEmail(createdUser.email, {
        fullName: createdUser.fullName,
        appName: "Chat App",
        clientUrl: process.env.CLIENT_URL || ""
      });
    }catch(err){
      console.error("Error sending welcome email:", err);
    }

    return res.status(201).json({
      _id: createdUser._id,
      fullName: createdUser.fullName,
      email: createdUser.email,
      profilePic: createdUser.profilePic
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({
        message: "Email already in use"
      });
    }

    console.error("Signup error:", err);
    return res.status(500).json({
      message: "Server error during signup"
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body || {};
  try {
    const normalizedEmail = email?.trim().toLowerCase();
    const sanitizedPassword = password?.trim();

    if (!normalizedEmail || !sanitizedPassword) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // Explicitly include password because schema marks it select: false
    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(sanitizedPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      message: "Server error during login"
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production" ? true : false
  });
  res.status(200).json({ message: "Logged out successfully" });
};