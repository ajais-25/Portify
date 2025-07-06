import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";
import {
    deleteFromCloudinary,
    uploadOnCloudinary,
} from "../utils/cloudinary.js";

const addProject = async (req, res) => {
    try {
        const {
            title,
            description,
            technologiesUsed,
            keyFeatures,
            githubLink,
            liveLink,
        } = req.body;

        const userId = req.user._id;

        // Parse JSON strings from FormData
        let parsedTechnologies;
        let parsedKeyFeatures;

        try {
            parsedTechnologies = JSON.parse(technologiesUsed);
            parsedKeyFeatures = JSON.parse(keyFeatures);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Invalid format for technologies or key features",
            });
        }

        if (
            !title ||
            !description ||
            !parsedTechnologies ||
            !parsedKeyFeatures ||
            !githubLink
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Title, description, technologies, key features, and GitHub link are required",
            });
        }

        let imageLocalPath = null;
        let uploadedImage = null;

        if (req.file) {
            imageLocalPath = req.file.path;

            uploadedImage = await uploadOnCloudinary(imageLocalPath);

            if (!uploadedImage) {
                return res.status(500).json({
                    success: false,
                    message: "Image upload failed",
                });
            }
        }

        const newProject = await Project.create({
            userId,
            title,
            description,
            technologiesUsed: parsedTechnologies,
            keyFeatures: parsedKeyFeatures,
            githubLink,
            liveLink: liveLink || "",
            imageURL: uploadedImage?.secure_url || "",
        });

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.projects.push(newProject._id);
        await user.save({ validateBeforeSave: false });

        return res.status(201).json({
            success: true,
            message: "Project added successfully",
            project: newProject,
        });
    } catch (error) {
        console.error("Error adding project:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find()
            .populate("userId", "name email")
            .populate("technologiesUsed", "name");

        return res.status(200).json({
            success: true,
            projects,
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const getUserProjects = async (req, res) => {
    try {
        const userId = req.user._id;

        const projects = await Project.find({ userId })
            .populate("userId", "name email")
            .populate("technologiesUsed", "name");

        if (projects.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No projects found for this user",
            });
        }

        return res.status(200).json({
            success: true,
            projects,
        });
    } catch (error) {
        console.error("Error fetching user projects:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching user projects",
            error: error.message,
        });
    }
};

const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findById(id)
            .populate("userId", "name email")
            .populate("technologiesUsed", "name");

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        return res.status(200).json({
            success: true,
            project,
        });
    } catch (error) {
        console.error("Error fetching project:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            technologiesUsed,
            keyFeatures,
            githubLink,
            liveLink,
        } = req.body;

        if (
            !title ||
            !description ||
            !technologiesUsed ||
            !keyFeatures ||
            !githubLink ||
            !liveLink
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const userId = req.user._id;

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        if (project.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this project",
            });
        }

        let imageLocalPath = null;
        let uploadedImage = null;

        if (req.file) {
            imageLocalPath = req.file.path;

            if (project.imageURL) {
                const publicId = project.imageURL
                    .split("/")
                    .pop()
                    .split(".")[0];
                await deleteFromCloudinary(publicId);
            }

            uploadedImage = await uploadOnCloudinary(imageLocalPath);

            if (!uploadedImage) {
                return res.status(500).json({
                    success: false,
                    message: "Image upload failed",
                });
            }
        } else {
            uploadedImage = {
                secure_url: project.imageURL, // Keep the existing image URL if no new image is uploaded
            };
        }

        project.title = title;
        project.description = description;
        project.technologiesUsed = technologiesUsed;
        project.keyFeatures = keyFeatures;
        project.githubLink = githubLink;
        project.liveLink = liveLink;
        project.imageURL = uploadedImage.secure_url;

        await project.save({ validateBeforeSave: false });

        return res.status(200).json({
            success: true,
            message: "Project updated successfully",
            project,
        });
    } catch (error) {
        console.error("Error updating project:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        const userId = req.user._id;

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        if (project.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this project",
            });
        }

        await deleteFromCloudinary(
            project.imageURL.split("/").pop().split(".")[0]
        );

        const user = await User.findById(project.userId);
        if (user) {
            user.projects.pull(project._id);
            await user.save({ validateBeforeSave: false });
        }

        await Project.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting project:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export {
    addProject,
    getAllProjects,
    getUserProjects,
    getProjectById,
    updateProject,
    deleteProject,
};
