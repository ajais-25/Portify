import { Technology } from "../models/technology.model.js";

const addTechnology = async (req, res) => {
    const { name, type, image } = req.body;

    if (!name || !type || !image) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }

    try {
        const user = req.user;

        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admins can add technologies",
            });
        }

        const technology = await Technology.create({
            name,
            type,
            image,
        });

        return res.status(201).json({
            success: true,
            message: "Technology added successfully",
            data: technology,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error adding technology",
            error: error.message,
        });
    }
};

const getTechnologies = async (req, res) => {
    try {
        const technologies = await Technology.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Technologies fetched successfully",
            data: technologies,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching technologies",
            error: error.message,
        });
    }
};

const getTechnologyById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Technology ID is required",
        });
    }

    try {
        const technology = await Technology.findById(id);

        if (!technology) {
            return res.status(404).json({
                success: false,
                message: "Technology not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Technology fetched successfully",
            data: technology,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching technology",
            error: error.message,
        });
    }
};

const deleteTechnology = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Technology ID is required",
        });
    }

    try {
        const user = req.user;

        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admins can delete technologies",
            });
        }

        const technology = await Technology.findByIdAndDelete(id);

        if (!technology) {
            return res.status(404).json({
                success: false,
                message: "Technology not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Technology deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error deleting technology",
            error: error.message,
        });
    }
};

export { addTechnology, getTechnologies, getTechnologyById, deleteTechnology };
