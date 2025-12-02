import { prisma } from "../config/prisma.js";

export const getProjects = async (req, res) => {
    try {
        const data = await prisma.project.findMany();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getProjectById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const data = await prisma.project.findUnique({ where: { id } });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createProject = async (req, res) => {
    try {
        const { name, description } = req.body;

        const data = await prisma.project.create({
            data: {
                name,
                description,
                file: req.file?.filename || null
            }
        });

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateProject = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, description } = req.body;

        const data = await prisma.project.update({
            where: { id },
            data: {
                name,
                description,
                file: req.file?.filename ?? undefined
            }
        });

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await prisma.project.delete({ where: { id } });
        res.json({ message: "Deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
