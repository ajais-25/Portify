import mongoose, { Schema } from "mongoose";

const portfolioSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        whatAreYou: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        country: {
            type: String,
            required: true,
            trim: true,
        },
        city: {
            type: String,
            required: true,
            trim: true,
        },
        socialLinks: {
            github: {
                type: String,
                required: true,
                trim: true,
            },
            linkedin: {
                type: String,
                required: true,
                trim: true,
            },
            twitter: {
                type: String,
                required: true,
                trim: true,
            },
            website: {
                type: String,
                required: false,
                trim: true,
            },
        },
        resume: {
            type: String,
            required: true,
            trim: true,
        },
        skills: [
            {
                type: Schema.Types.ObjectId,
                ref: "Technology",
                required: true,
            },
        ],
        education: [
            {
                institution: {
                    type: String,
                    required: true,
                    trim: true,
                },
                degree: {
                    type: String,
                    required: true,
                    trim: true,
                },
                startDate: {
                    type: Date,
                    required: true,
                },
                endDate: {
                    type: Date,
                    required: false,
                },
            },
        ],
        experience: [
            {
                company: {
                    type: String,
                    required: true,
                    trim: true,
                },
                position: {
                    type: String,
                    required: true,
                    trim: true,
                },
                startDate: {
                    type: Date,
                    required: true,
                },
                endDate: {
                    type: Date,
                    required: false,
                },
                responsibilities: [
                    {
                        type: String,
                        required: true,
                        trim: true,
                    },
                ],
            },
        ],
        projects: [
            {
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
                image: {
                    type: String,
                    required: false,
                    trim: true,
                },
            },
        ],
    },
    { timestamps: true }
);

export const Portfolio = mongoose.model("Portfolio", portfolioSchema);
