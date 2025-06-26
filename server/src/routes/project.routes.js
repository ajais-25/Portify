import { Router } from "express";
import {
    addProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
} from "../controllers/project.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyUser);

router
    .route("/")
    .post(upload.single("imageURL"), addProject)
    .get(getAllProjects);

router
    .route("/:id")
    .get(getProjectById)
    .put(upload.single("imageURL"), updateProject)
    .delete(deleteProject);

export default router;
