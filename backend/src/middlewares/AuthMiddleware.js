import jwt from 'jsonwebtoken';
import { User } from "../models/User.js";
import { ENV } from "../lib/env.js";

export const routeProtect = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized: No token provided"
    });
  }

  const decoded = jwt.verify(token, ENV.JWT_SECRET);
  if (!decoded || !decoded.userId) {
    return res.status(401).json({
      message: "Unauthorized: Invalid token"
    });
  }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized: User not found"
      });
    }
    req.userId = user._id;
    next();
};