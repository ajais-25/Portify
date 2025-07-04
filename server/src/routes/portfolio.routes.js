import { Router } from "express";
import { getPortfolio } from "../controllers/portfolio.controller.js";

const router = Router();

router.route("/:username").get(getPortfolio);

export default router;
