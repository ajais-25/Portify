import { User } from "../models/user.model.js";
import { AICooldown } from "../models/aiCooldown.model.js";
import {
    buildAboutContextFromUser,
    mergeDraftOverrides,
    deriveYearsAndToneFromExperience,
    buildAboutDescriptionPrompt,
    streamAboutDescriptionFromGemini,
    sanitizeGeneratedDescription,
} from "../services/ai.service.js";

const writeSSE = (res, event, data) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
};

const validateGenerateAboutInput = ({ targetRole }) => {
    if (!targetRole || typeof targetRole !== "string" || !targetRole.trim()) {
        return "Target role is required";
    }

    return null;
};

const streamAboutDescription = async (req, res) => {
    const { targetRole, draftOverrides } = req.body;

    const validationError = validateGenerateAboutInput({
        targetRole,
    });

    if (validationError) {
        return res.status(400).json({
            success: false,
            message: validationError,
        });
    }

    try {
        const user = await User.findById(req.user._id)
            .populate("skills", "name")
            .populate({
                path: "projects",
                select: "title description keyFeatures technologiesUsed",
                populate: {
                    path: "technologiesUsed",
                    select: "name",
                },
            })
            .select(
                "name username tagline description resume skills projects experience"
            );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const baseContext = buildAboutContextFromUser(user);
        const mergedContext = mergeDraftOverrides(
            baseContext,
            draftOverrides || {}
        );
        const { yearsOfExperience, tone } = deriveYearsAndToneFromExperience(
            mergedContext.experience
        );

        const prompt = buildAboutDescriptionPrompt({
            targetRole: targetRole.trim(),
            yearsOfExperience,
            tone,
            context: mergedContext,
        });

        let hasClientDisconnected = false;
        req.on("close", () => {
            hasClientDisconnected = true;
        });

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.setHeader("X-Accel-Buffering", "no");
        res.flushHeaders();

        writeSSE(res, "metadata", {
            maxLines: 6,
            minLines: 5,
            yearsOfExperience,
            tone,
        });

        let fullText = "";

        await streamAboutDescriptionFromGemini(prompt, (chunkText) => {
            if (hasClientDisconnected) {
                return;
            }

            fullText += chunkText;
            writeSSE(res, "chunk", { text: chunkText });
        });

        if (hasClientDisconnected) {
            return;
        }

        const finalText = sanitizeGeneratedDescription(fullText);

        if (finalText) {
            await AICooldown.findOneAndUpdate(
                { user: req.user._id },
                {
                    $set: {
                        generatedAboutDescription: finalText,
                        generatedAboutAt: new Date(),
                    },
                },
                { upsert: true }
            );
        }

        writeSSE(res, "done", {
            text: finalText,
        });

        res.end();
    } catch (error) {
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: "Failed to generate AI description",
            });
        }

        writeSSE(res, "error", {
            message: error.message || "Failed to generate AI description",
        });
        res.end();
    }
};

export { streamAboutDescription };
