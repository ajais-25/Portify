import { Router } from "express";
import { getPortfolio } from "../controllers/portfolio.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyUser);

router.route("/:username").get(getPortfolio);

export default router;
