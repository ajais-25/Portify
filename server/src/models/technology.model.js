import mongoose, { Schema } from "mongoose";

const technologySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            required: true,
            enum: [
                "frontend",
                "backend",
                "fullstack",
                "tools",
                "database",
                "cloud",
                "devops",
                "mobile",
                "data science",
                "others",
            ],
        },
        image: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

const Technology = mongoose.model("Skill", technologySchema);

export default Technology;
