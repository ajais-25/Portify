import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
            required: true,
        },
        whatAreYou: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        country: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        socialLinks: {
            github: {
                type: String,
                trim: true,
            },
            linkedin: {
                type: String,
                trim: true,
            },
            twitter: {
                type: String,
                trim: true,
            },
            website: {
                type: String,
                trim: true,
            },
        },
        resume: {
            type: String,
            trim: true,
        },
        skills: [
            {
                type: Schema.Types.ObjectId,
                ref: "Technology",
            },
        ],
        experience: [
            {
                company: {
                    type: String,
                    trim: true,
                },
                position: {
                    type: String,
                    trim: true,
                },
                startDate: {
                    type: String, // Format: "MM/YYYY"
                    trim: true,
                },
                endDate: {
                    type: String, // Format: "MM/YYYY", optional
                    trim: true,
                },
                responsibilities: [
                    {
                        type: String,
                        trim: true,
                    },
                ],
            },
        ],
        projects: [
            {
                type: Schema.Types.ObjectId,
                ref: "Project",
            },
        ],
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    next();
});

userSchema.methods.verifyPassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email,
            username: this.username,
            role: this.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", userSchema);
