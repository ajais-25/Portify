import { Router } from "express";
import {
    addTechnology,
    getTechnologies,
    getTechnologyById,
    deleteTechnology,
} from "../controllers/technology.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyUser);

router.route("/").get(getTechnologies).post(addTechnology);
router.route("/:id").get(getTechnologyById).delete(deleteTechnology);

export default router;
