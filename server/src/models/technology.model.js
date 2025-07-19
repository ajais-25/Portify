import mongoose, { Schema } from "mongoose";

const technologySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

export const Technology = mongoose.model("Technology", technologySchema);
