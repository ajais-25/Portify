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
        tagline: {
            type: String,
            required: true,
            default: "Empowering the web with scalable, future-ready solutions",
            trim: true,
        },
        description: {
            type: String,
            required: true,
            default:
                "I'm a full-stack developer with a passion for crafting scalable, user-centric digital solutions. I specialize in building modern web applications using technologies like React, Node.js, MongoDB, and Tailwind CSS. From intuitive UI design to robust backend architecture, I bring end-to-end product visions to life with clean code and problem-solving mindset.",
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
            required: true,
        },
        skills: [
            {
                type: Schema.Types.ObjectId,
                ref: "Technology",
                required: true,
            },
        ],
        experience: [
            {
                company: {
                    type: String,
                    trim: true,
                    required: true,
                },
                position: {
                    type: String,
                    trim: true,
                    required: true,
                },
                startDate: {
                    type: String, // Format: "MM/YYYY"
                    trim: true,
                    required: true,
                },
                endDate: {
                    type: String, // Format: "MM/YYYY", optional
                    trim: true,
                },
                responsibilities: [
                    {
                        type: String,
                        trim: true,
                        required: true,
                    },
                ],
            },
        ],
        projects: [
            {
                type: Schema.Types.ObjectId,
                ref: "Project",
                required: true,
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
