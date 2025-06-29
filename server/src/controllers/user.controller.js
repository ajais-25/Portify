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
    const { whatAreYou, description, phone, country, city } = req.body;

    if (!whatAreYou || !description || !phone || !country || !city) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
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

        user.whatAreYou = whatAreYou;
        user.description = description;
        user.phone = phone;
        user.country = country;
        user.city = city;

        await user.save({ validateBeforeSave: false });

        return res.status(200).json({
            success: true,
            message: "User about updated successfully",
            data: {
                whatAreYou: user.whatAreYou,
                description: user.description,
                phone: user.phone,
                country: user.country,
                city: user.city,
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

    if (!skills || !resume) {
        return res.status(400).json({
            success: false,
            message: "Skills and resume are required",
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

        return res.status(200).json({
            success: true,
            message: "User skills and resume updated successfully",
            data: {
                skills: user.skills,
                resume: user.resume,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating user skills and resume",
        });
    }
};

const updateUserEducation = async (req, res) => {
    const { education } = req.body;

    if (!education || !Array.isArray(education)) {
        return res.status(400).json({
            success: false,
            message: "Education is required and must be an array",
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

        user.education = education;

        await user.save({ validateBeforeSave: false });

        return res.status(200).json({
            success: true,
            message: "User education updated successfully",
            data: user.education,
        });
    } catch (error) {
        console.error("Error updating user education:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating user education",
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
            .populate("projects.technologiesUsed", "name")
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
    updateUserEducation,
    updateUserExperience,
    getUserProfile,
};
