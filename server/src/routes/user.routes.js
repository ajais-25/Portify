import { Router } from "express";
import { register, login, logout } from "../controllers/user.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.route("/register").post(register);
router.route("/login").post(login);

// Protected routes
router.route("/logout").post(verifyUser, logout);

export default router;
