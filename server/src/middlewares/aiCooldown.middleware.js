import { AICooldown } from "../models/aiCooldown.model.js";

const COOLDOWN_MS = 60 * 1000; // 1 minute cooldown

const aiCooldown = async (req, res, next) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized request",
            });
        }

        const now = new Date();
        const cooldownThreshold = new Date(now.getTime() - COOLDOWN_MS);

        const updatedDoc = await AICooldown.findOneAndUpdate(
            {
                user: userId,
                lastRequestAt: { $lte: cooldownThreshold },
            },
            {
                $set: { lastRequestAt: now },
            },
            {
                new: true,
            }
        ).select("lastRequestAt");

        if (updatedDoc) {
            return next();
        }

        try {
            await AICooldown.create({
                user: userId,
                lastRequestAt: now,
            });
            return next();
        } catch (error) {
            // E11000 duplicate key means the user already has a cooldown record.
            if (error?.code !== 11000) {
                throw error;
            }
        }

        const cooldownDoc = await AICooldown.findOne({ user: userId }).select(
            "lastRequestAt"
        );

        const elapsedMs =
            cooldownDoc?.lastRequestAt instanceof Date
                ? now.getTime() - cooldownDoc.lastRequestAt.getTime()
                : COOLDOWN_MS;

        if (elapsedMs < COOLDOWN_MS) {
            return res.status(429).json({
                success: false,
                message: "Please wait a few seconds before generating again",
                data: {
                    retryAfterMs: COOLDOWN_MS - elapsedMs,
                },
            });
        }

        await AICooldown.findOneAndUpdate(
            { user: userId },
            { $set: { lastRequestAt: now } },
            { upsert: true }
        );

        return next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to validate AI cooldown",
        });
    }
};

export { aiCooldown };
