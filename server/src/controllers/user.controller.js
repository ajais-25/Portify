import { User } from "../models/user.model.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        return res.status(500).json({
            message:
                "Something went wrong while genrating refresh and access token",
        });
    }
};

const signup = async (req, res) => {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
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
                .json({ message: "Error while creating user" });
        }

        return res
            .status(200)
            .json({ message: "User registered successfully" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await User.findOne({ email }).select(
            "-password -refreshToken"
        );

        if (!user) {
            return res.status(400).json({ message: "User not registered" });
        }

        if (!user.verifyPassword(password)) {
            return res.status(400).json({ message: "Invalid Password" });
        }

        const { accessToken, refreshToken } =
            await generateAccessAndRefreshToken(user._id);

        const loggedInUser = await User.findById(user._id).select(
            "-password -refreshToken"
        );

        const options = {
            httpOnly: true,
            secure: true,
        };

        res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                data: loggedInUser,
                message: "User logged in successfully",
            });
    } catch (error) {
        res.status(500).json({ error: "Error logging in user" });
    }
};
