import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

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