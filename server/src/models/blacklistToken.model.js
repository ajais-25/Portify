import mongoose, { Schema } from "mongoose";

const blacklistTokenSchema = new Schema({
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: "1h",
    },
});

export const BlacklistToken = mongoose.model(
    "BlacklistToken",
    blacklistTokenSchema
);
