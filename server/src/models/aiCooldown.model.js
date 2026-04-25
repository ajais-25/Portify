import mongoose, { Schema } from "mongoose";

const aiCooldownSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true,
        },
        lastRequestAt: {
            type: Date,
            required: true,
            default: Date.now,
        },
        generatedAboutDescription: {
            type: String,
            trim: true,
            default: "",
        },
        generatedAboutAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

export const AICooldown = mongoose.model("AICooldown", aiCooldownSchema);
