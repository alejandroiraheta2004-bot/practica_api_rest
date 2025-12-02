import { Router } from "express";
import { createProject, getProjects, getProjectById, updateProject, deleteProject } from "../controller/project.Controller.js";
import upload from "../config/multer.config.js";

const router = Router();

router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/", upload.single("file"), createProject);
router.put("/:id", upload.single("file"), updateProject);
router.delete("/:id", deleteProject);

export default router;
