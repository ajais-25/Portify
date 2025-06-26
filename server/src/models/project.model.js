import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        technologiesUsed: [
            {
                type: Schema.Types.ObjectId,
                ref: "Technology",
                required: true,
            },
        ],
        keyFeatures: [
            {
                type: String,
                required: true,
                trim: true,
            },
        ],
        githubLink: {
            type: String,
            required: true,
            trim: true,
        },
        liveLink: {
            type: String,
            required: false,
            trim: true,
        },
        imageURL: {
            type: String,
            required: false,
            trim: true,
        },
    },
    { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);
