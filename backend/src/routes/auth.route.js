import express from "express";
import { signup } from "../controllers/AuthController.js";

const router = express.Router();

router.post("/signup", signup);

router.get("/login", (req, res) => {
  res.json({ message: "Login route" });
}); 


export default router;