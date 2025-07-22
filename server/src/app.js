import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

const app = express();

app.use(
    cors({
        origin: process.env.CORS,
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Import routes
import userRoutes from "./routes/user.routes.js";
import technologyRoutes from "./routes/technology.routes.js";
import projectRoutes from "./routes/project.routes.js";
import portfolioRoutes from "./routes/portfolio.routes.js";

// Routes declaration
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/technologies", technologyRoutes);
app.use("/api/v1/project", projectRoutes);
app.use("/api/v1/portfolio", portfolioRoutes);

export default app;
