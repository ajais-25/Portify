import { User } from "../models/user.model.js";

const register = async (req, res) => {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
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

export { register, login, logout };
