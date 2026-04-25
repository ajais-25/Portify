import { Router } from "express";
import { streamAboutDescription } from "../controllers/ai.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { aiCooldown } from "../middlewares/aiCooldown.middleware.js";

const router = Router();

router.post(
    "/about-description/stream",
    verifyUser,
    aiCooldown,
    streamAboutDescription
);

export default router;
