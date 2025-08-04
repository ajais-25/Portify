import { User } from "../models/user.model.js";

const register = async (req, res) => {
    const { name, username, email, password, role } = req.body;

    if (!name || !username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }

    // Validate role if provided
    if (role && !["user", "admin"].includes(role)) {
        return res.status(400).json({
            success: false,
            message: "Role must be either 'user' or 'admin'",
        });
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res
                .status(400)
                .json({ success: false, message: "User already exists" });
        }

        const existingUsername = await User.findOne({ username });

        if (existingUsername) {
            return res
                .status(400)
                .json({ success: false, message: "Username not available" });
        }
        const user = await User.create({
            name,
            email,
            username,
            password,
            ...(role && { role }), // Only include role if provided
        });

        if (!user) {
            return res
                .status(500)
                .json({ success: false, message: "Error while creating user" });
        }

        const token = user.generateAuthToken();

        const options = {
            httpOnly: true,
            secure: true,
        };

        return res
            .status(200)
            .cookie("token", token, options)
            .json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    username: user.username,
                    role: user.role,
                },
                token,
                message: "User registered successfully",
            });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res
            .status(400)
            .json({ success: false, message: "All fields are required" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "User not registered" });
        }

        const isPasswordValid = await user.verifyPassword(password);

        if (!isPasswordValid) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid Password" });
        }

        const token = user.generateAuthToken();

        const loggedInUser = await User.findById(user._id).select("-password");

        const options = {
            httpOnly: true,
            secure: true,
        };

        res.status(200).cookie("token", token, options).json({
            success: true,
            data: loggedInUser,
            token,
            message: "User logged in successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error logging in user",
        });
    }
};

const logout = async (req, res) => {
    try {
        const options = {
            httpOnly: true,
            secure: true,
        };

        res.status(200)
            .clearCookie("token", options)
            .json({ success: true, message: "User logged out successfully" });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error logging out user",
        });
    }
};

// profile controllers
const updateUserAbout = async (req, res) => {
    const { tagline, description } = req.body;

    if (!tagline || !description) {
        return res.status(400).json({
            success: false,
            message: "Tagline and Description are required",
        });
    }

    try {
        const userId = req.user._id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.tagline = tagline;
        user.description = description;

        await user.save({ validateBeforeSave: false });

        return res.status(200).json({
            success: true,
            message: "User about updated successfully",
            data: {
                tagline: user.tagline,
                description: user.description,
            },
        });
    } catch (error) {
        console.error("Error updating user about:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating user about",
        });
    }
};

const updateUserSocialLinks = async (req, res) => {
    try {
        const { github, linkedin, twitter, website } = req.body;

        const userId = req.user._id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.socialLinks.github = github;
        user.socialLinks.linkedin = linkedin;
        user.socialLinks.twitter = twitter;
        user.socialLinks.website = website;

        await user.save({ validateBeforeSave: false });

        return res.status(200).json({
            success: true,
            message: "User social links updated successfully",
            data: user.socialLinks,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating user social links",
        });
    }
};

const updateUserSkillsAndResume = async (req, res) => {
    const { skills, resume } = req.body;

    if (skills.length == 0 || !resume) {
        return res.status(400).json({
            success: false,
            message: "Skills and Resume are required",
        });
    }

    try {
        const userId = req.user._id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.skills = skills;
        user.resume = resume;

        await user.save({ validateBeforeSave: false });

        const newSkills = await User.findById(userId)
            .populate("skills", "name")
            .select("skills");

        return res.status(200).json({
            success: true,
            message: "User skills and resume updated successfully",
            data: {
                skills: newSkills.skills,
                resume,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating user skills and resume",
        });
    }
};

const updateUserExperience = async (req, res) => {
    const { experience } = req.body;

    if (!experience || !Array.isArray(experience)) {
        return res.status(400).json({
            success: false,
            message: "Experience is required and must be an array",
        });
    }

    // Validate each experience entry
    for (let i = 0; i < experience.length; i++) {
        const exp = experience[i];
        const missingFields = [];

        if (!exp.company || exp.company.trim() === "") {
            missingFields.push("company");
        }
        if (!exp.position || exp.position.trim() === "") {
            missingFields.push("position");
        }
        if (!exp.startDate || exp.startDate.trim() === "") {
            missingFields.push("startDate");
        }
        if (
            !exp.responsibilities ||
            !Array.isArray(exp.responsibilities) ||
            exp.responsibilities.length === 0
        ) {
            missingFields.push("responsibilities");
        }

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Experience entry ${i + 1} is missing required fields: ${missingFields.join(", ")}`,
            });
        }

        // Validate responsibilities array
        for (let j = 0; j < exp.responsibilities.length; j++) {
            if (
                !exp.responsibilities[j] ||
                exp.responsibilities[j].trim() === ""
            ) {
                return res.status(400).json({
                    success: false,
                    message: `Experience entry ${i + 1} has empty responsibility at position ${j + 1}`,
                });
            }
        }

        // Validate date format and logic (MM/YYYY)
        const dateRegex = /^(0[1-9]|1[0-2])\/\d{4}$/;

        if (!dateRegex.test(exp.startDate)) {
            return res.status(400).json({
                success: false,
                message: `Experience entry ${i + 1} has invalid start date format. Expected format: MM/YYYY`,
            });
        }

        if (exp.endDate && exp.endDate.trim() !== "") {
            if (!dateRegex.test(exp.endDate)) {
                return res.status(400).json({
                    success: false,
                    message: `Experience entry ${i + 1} has invalid end date format. Expected format: MM/YYYY`,
                });
            }

            // Compare dates (convert MM/YYYY to comparable format)
            const [startMonth, startYear] = exp.startDate
                .split("/")
                .map(Number);
            const [endMonth, endYear] = exp.endDate.split("/").map(Number);

            const startDate = new Date(startYear, startMonth - 1);
            const endDate = new Date(endYear, endMonth - 1);

            if (endDate <= startDate) {
                return res.status(400).json({
                    success: false,
                    message: `Experience entry ${i + 1}: end date must be greater than start date`,
                });
            }
        }
    }

    try {
        const userId = req.user._id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.experience = experience;

        await user.save({ validateBeforeSave: false });

        return res.status(200).json({
            success: true,
            message: "User experience updated successfully",
            data: user.experience,
        });
    } catch (error) {
        console.error("Error updating user experience:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating user experience",
        });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId)
            .populate("skills", "name")
            .populate("projects")
            .populate({
                path: "projects",
                populate: {
                    path: "technologiesUsed",
                    select: "name",
                },
            })
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error("Error retrieving user profile:", error);
        return res.status(500).json({
            success: false,
            message: "Error retrieving user profile",
        });
    }
};

export {
    register,
    login,
    logout,
    updateUserAbout,
    updateUserSocialLinks,
    updateUserSkillsAndResume,
    updateUserExperience,
    getUserProfile,
};
