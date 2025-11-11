import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Limit signups: max 5 requests per hour per IP
const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // limit each IP to 5 signup requests per windowMs
  message: "Too many signup attempts from this IP, please try again after an hour"
});

router.post("/signup", signupLimiter, signup);

router.post("/login",login);

router.post("/logout",logout);

export default router;