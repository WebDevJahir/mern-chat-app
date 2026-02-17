import express from "express";
import { signup, login, logout, updateProfile } from "../controllers/AuthController.js";
import { routeProtect } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login); 

router.get("/logout", logout); 

router.get("/update-profile", routeProtect, updateProfile);


export default router;