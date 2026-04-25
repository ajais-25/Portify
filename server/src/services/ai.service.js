import { GoogleGenAI } from "@google/genai";

const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-3-flash-preview";

const normalizeArray = (value) => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.filter(Boolean);
};

const parseMonthYear = (value) => {
    if (typeof value !== "string") {
        return null;
    }

    const match = value.trim().match(/^(0[1-9]|1[0-2])\/(\d{4})$/);

    if (!match) {
        return null;
    }

    const month = Number(match[1]);
    const year = Number(match[2]);
    return new Date(year, month - 1, 1);
};

const deriveYearsAndToneFromExperience = (experience = []) => {
    const now = new Date();
    let minStartDate = null;
    let maxEndDate = null;

    for (const exp of normalizeArray(experience)) {
        const start = parseMonthYear(exp.startDate);

        if (!start) {
            continue;
        }

        const end = parseMonthYear(exp.endDate) || now;
        const normalizedEnd = end < start ? start : end;

        if (!minStartDate || start < minStartDate) {
            minStartDate = start;
        }

        if (!maxEndDate || normalizedEnd > maxEndDate) {
            maxEndDate = normalizedEnd;
        }
    }

    if (!minStartDate || !maxEndDate) {
        return {
            yearsOfExperience: 0,
            tone: "fresher",
        };
    }

    const months =
        (maxEndDate.getFullYear() - minStartDate.getFullYear()) * 12 +
        (maxEndDate.getMonth() - minStartDate.getMonth());
    const yearsOfExperience = Number(Math.max(months, 0) / 12).toFixed(1);
    const numericYears = Number(yearsOfExperience);

    return {
        yearsOfExperience: numericYears,
        tone: numericYears >= 2 ? "experienced" : "fresher",
    };
};

const buildAboutContextFromUser = (user) => {
    const skills = normalizeArray(user.skills)
        .map((skill) => skill.name)
        .filter(Boolean);

    const projects = normalizeArray(user.projects).map((project) => ({
        title: project.title || "",
        description: project.description || "",
        technologiesUsed: normalizeArray(project.technologiesUsed)
            .map((tech) => tech.name)
            .filter(Boolean),
        keyFeatures: normalizeArray(project.keyFeatures).filter(Boolean),
    }));

    const experience = normalizeArray(user.experience).map((exp) => ({
        company: exp.company || "",
        position: exp.position || "",
        startDate: exp.startDate || "",
        endDate: exp.endDate || "Present",
        responsibilities: normalizeArray(exp.responsibilities).filter(Boolean),
    }));

    return {
        name: user.name || "",
        username: user.username || "",
        tagline: user.tagline || "",
        description: user.description || "",
        skills,
        projects,
        experience,
    };
};

const mergeDraftOverrides = (baseContext, draftOverrides = {}) => {
    const merged = { ...baseContext };

    if (typeof draftOverrides.tagline === "string") {
        merged.tagline = draftOverrides.tagline.trim();
    }

    if (typeof draftOverrides.description === "string") {
        merged.description = draftOverrides.description.trim();
    }

    if (Array.isArray(draftOverrides.skills)) {
        merged.skills = draftOverrides.skills
            .map((skill) => (typeof skill === "string" ? skill.trim() : ""))
            .filter(Boolean);
    }

    if (Array.isArray(draftOverrides.projects)) {
        merged.projects = draftOverrides.projects
            .map((project) => ({
                title:
                    typeof project?.title === "string"
                        ? project.title.trim()
                        : "",
                description:
                    typeof project?.description === "string"
                        ? project.description.trim()
                        : "",
                technologiesUsed: Array.isArray(project?.technologiesUsed)
                    ? project.technologiesUsed
                          .map((tech) =>
                              typeof tech === "string" ? tech.trim() : ""
                          )
                          .filter(Boolean)
                    : [],
                keyFeatures: Array.isArray(project?.keyFeatures)
                    ? project.keyFeatures
                          .map((feature) =>
                              typeof feature === "string" ? feature.trim() : ""
                          )
                          .filter(Boolean)
                    : [],
            }))
            .filter(
                (project) =>
                    project.title ||
                    project.description ||
                    project.technologiesUsed.length > 0 ||
                    project.keyFeatures.length > 0
            );
    }

    return merged;
};

const buildAboutDescriptionPrompt = ({
    targetRole,
    yearsOfExperience,
    tone,
    context,
}) => {
    const toneInstruction =
        tone === "fresher"
            ? "Use a confident fresher voice: emphasize learning velocity, project ownership, and readiness to contribute."
            : "Use an experienced professional voice: emphasize delivery impact, ownership, and outcomes.";

    const compactProjects = context.projects
        .slice(0, 5)
        .map((project, index) => ({
            index: index + 1,
            title: project.title,
            description: project.description,
            technologiesUsed: project.technologiesUsed,
            keyFeatures: project.keyFeatures,
        }));

    const compactExperience = context.experience
        .slice(0, 5)
        .map((exp, index) => ({
            index: index + 1,
            company: exp.company,
            position: exp.position,
            startDate: exp.startDate,
            endDate: exp.endDate,
            responsibilities: exp.responsibilities,
        }));

    return [
        "You are writing a concise professional portfolio about description.",
        "Return plain text only.",
        "Output must be exactly 5 or 6 lines, separated by newline characters.",
        "Do not output headings, bullets, markdown, labels, or JSON.",
        "Do not invent facts that are not present in the context.",
        "Use first person voice.",
        toneInstruction,
        "",
        `Target role: ${targetRole}`,
        `Years of experience: ${yearsOfExperience}`,
        `Tone: ${tone}`,
        "",
        "Candidate context:",
        JSON.stringify(
            {
                name: context.name,
                username: context.username,
                tagline: context.tagline,
                existingDescription: context.description,
                skills: context.skills,
                projects: compactProjects,
                experience: compactExperience,
            },
            null,
            2
        ),
    ].join("\n");
};

const createGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is missing in environment variables");
    }

    return new GoogleGenAI({ apiKey });
};

const streamAboutDescriptionFromGemini = async (prompt, onChunk) => {
    const ai = createGeminiClient();
    const result = await ai.models.generateContentStream({
        model: DEFAULT_MODEL,
        contents: prompt,
    });

    for await (const chunk of result) {
        const text =
            typeof chunk.text === "function" ? chunk.text() : chunk.text || "";

        if (text) {
            onChunk(text);
        }
    }
};

const sanitizeGeneratedDescription = (value) => {
    const text = (value || "").replace(/\r\n/g, "\n").trim();

    if (!text) {
        return "";
    }

    const lines = text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, 6);

    return lines.join("\n");
};

export {
    buildAboutContextFromUser,
    mergeDraftOverrides,
    deriveYearsAndToneFromExperience,
    buildAboutDescriptionPrompt,
    streamAboutDescriptionFromGemini,
    sanitizeGeneratedDescription,
};
