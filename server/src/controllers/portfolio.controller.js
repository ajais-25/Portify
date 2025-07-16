import { User } from "../models/user.model.js";

const getPortfolio = async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({
            success: false,
            message: "Username is missing",
        });
    }

    try {
        const user = await User.findOne({ username: username })
            .populate("skills", "name type image")
            .populate(
                "projects",
                "title description technologiesUsed keyFeatures githubLink liveLink imageURL"
            )
            .populate({
                path: "projects",
                populate: {
                    path: "technologiesUsed",
                    select: "name",
                },
            })
            .select("-password -__v");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Portfolio fetched successfully",
            data: user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching Portfolio",
            error: error.message,
        });
    }
};

export { getPortfolio };
