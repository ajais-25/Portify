import { Technology } from "../models/technology.model.js";

const createPortfolio = async (req, res) => {
    try {
        const {
            whatAreYou,
            description,
            email,
            phone,
            country,
            city,
            socialLinks,
            resume,
            skills,
            education,
            experience,
        } = req.body;

        // Validate required fields
        if (
            !whatAreYou ||
            !description ||
            !email ||
            !phone ||
            !country ||
            !city
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Basic information fields are required: whatAreYou, description, email, phone, country, city",
            });
        } // Validate social links (now optional)
        if (socialLinks) {
            // If social links are provided, validate the structure but individual links are optional
            if (typeof socialLinks !== "object") {
                return res.status(400).json({
                    success: false,
                    message: "Social links must be an object",
                });
            }
        }

        // Validate resume
        if (!resume) {
            return res.status(400).json({
                success: false,
                message: "Resume is required",
            });
        }

        // Check if user already has a portfolio
        const existingPortfolio = await Portfolio.findOne({
            userId: req.user._id,
        });
        if (existingPortfolio) {
            return res.status(400).json({
                success: false,
                message:
                    "Portfolio already exists for this user. Use update endpoint to modify it.",
            });
        }

        // Validate skills (Technology IDs)
        if (skills && skills.length > 0) {
            const validSkills = await Technology.find({ _id: { $in: skills } });
            if (validSkills.length !== skills.length) {
                return res.status(400).json({
                    success: false,
                    message: "One or more skill IDs are invalid",
                });
            }
        }

        // Validate education entries
        if (education && education.length > 0) {
            for (const edu of education) {
                if (!edu.institution || !edu.degree || !edu.startDate) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "Each education entry must have institution, degree, and startDate",
                    });
                }
            }
        }

        // Validate experience entries
        if (experience && experience.length > 0) {
            for (const exp of experience) {
                if (!exp.company || !exp.position || !exp.startDate) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "Each experience entry must have company, position, and startDate",
                    });
                }

                if (
                    !exp.responsibilities ||
                    exp.responsibilities.length === 0
                ) {
                    return res.status(400).json({
                        success: false,
                        message: `Experience at ${exp.company} must have at least one responsibility`,
                    });
                }
            }
        }

        // Create the portfolio
        const portfolio = await Portfolio.create({
            userId: req.user._id,
            whatAreYou,
            description,
            email,
            phone,
            country,
            city,
            socialLinks: socialLinks || {},
            resume,
            skills: skills || [],
            education: education || [],
            experience: experience || [],
        });

        if (!portfolio) {
            return res.status(500).json({
                success: false,
                message: "Error while creating portfolio",
            });
        }

        // Populate the portfolio with technology details
        const populatedPortfolio = await Portfolio.findById(portfolio._id)
            .populate("skills", "name category")
            .populate("projects.technologiesUsed", "name category");

        return res.status(201).json({
            success: true,
            data: populatedPortfolio,
            message: "Portfolio created successfully",
        });
    } catch (error) {
        console.error("Error creating portfolio:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while creating portfolio",
        });
    }
};

const getPortfolioById = async (req, res) => {
    const { id } = req.params;

    try {
        // Validate the ID format
        if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid portfolio ID format",
            });
        }

        // Fetch the portfolio by ID
        const portfolio = await Portfolio.findById(id)
            .populate("skills", "name type image")
            .populate("projects.technologiesUsed", "name");

        if (!portfolio) {
            return res.status(404).json({
                success: false,
                message: "Portfolio not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: portfolio,
            message: "Portfolio fetched successfully",
        });
    } catch (error) {
        console.error("Error fetching portfolio:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching portfolio",
        });
    }
};

const updatePortfolio = async (req, res) => {
    const { id } = req.params;

    try {
        // Validate the ID format
        if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid portfolio ID format",
            });
        }

        // Fetch the existing portfolio
        const portfolio = await Portfolio.findById(id);
        if (!portfolio) {
            return res.status(404).json({
                success: false,
                message: "Portfolio not found",
            });
        }

        // Update the portfolio with new data
        Object.assign(portfolio, req.body);

        // Save the updated portfolio
        const updatedPortfolio = await portfolio.save();

        return res.status(200).json({
            success: true,
            data: updatedPortfolio,
            message: "Portfolio updated successfully",
        });
    } catch (error) {
        console.error("Error updating portfolio:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while updating portfolio",
        });
    }
};

const deletePortfolio = async (req, res) => {
    const { id } = req.params;

    try {
        // Validate the ID format
        if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid portfolio ID format",
            });
        }

        // Fetch the portfolio by ID
        const portfolio = await Portfolio.findByIdAndDelete(id);
        if (!portfolio) {
            return res.status(404).json({
                success: false,
                message: "Portfolio not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Portfolio deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting portfolio:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while deleting portfolio",
        });
    }
};

export { createPortfolio, getPortfolioById, updatePortfolio, deletePortfolio };
