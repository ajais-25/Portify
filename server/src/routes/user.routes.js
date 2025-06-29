import { Router } from "express";
import {
    register,
    login,
    logout,
    updateUserAbout,
    updateUserSocialLinks,
    updateUserSkillsAndResume,
    updateUserEducation,
    updateUserExperience,
    getUserProfile,
} from "../controllers/user.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.route("/register").post(register);
router.route("/login").post(login);

// Protected routes
router.route("/logout").post(verifyUser, logout);

// profile routes
router.route("/profile").get(verifyUser, getUserProfile);

// update user information
router.route("/profile/about").put(verifyUser, updateUserAbout);
router.route("/profile/social-links").put(verifyUser, updateUserSocialLinks);
router
    .route("/profile/skills-resume")
    .put(verifyUser, updateUserSkillsAndResume);
router.route("/profile/education").put(verifyUser, updateUserEducation);
router.route("/profile/experience").put(verifyUser, updateUserExperience);

export default router;
