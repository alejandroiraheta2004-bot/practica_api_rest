import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import projectRoutes from "./Routes/project.Routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/projects", projectRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
