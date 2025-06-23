import { Router } from "express";
import {
    createPortfolio,
    getPortfolioById,
    updatePortfolio,
    deletePortfolio,
} from "../controllers/portfolio.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyUser);

router.route("/").post(createPortfolio);
router
    .route("/:id")
    .get(getPortfolioById)
    .put(updatePortfolio)
    .delete(deletePortfolio);

export default router;
