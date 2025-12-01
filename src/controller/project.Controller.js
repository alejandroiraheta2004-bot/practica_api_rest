const { PrismaClient } = require('@prisma/client');
const { createProjectSchema, updateProjectSchema } = require('../validators/projectValidator');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Crear proyecto
exports.createProject = async (req, res) => {
    try {
        const data = createProjectSchema.parse(req.body);

        const project = await prisma.project.create({
            data: {
                ...data,
                document: req.file ? req.file.filename : null,
                start_date: data.start_date ? new Date(data.start_date) : null,
                end_date: data.end_date ? new Date(data.end_date) : null
            },
            include: { user: true }
        });

        res.status(201).json({
            success: true,
            message: 'Proyecto creado exitosamente',
            data: project
        });
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({
                success: false,
                message: 'Error de validación',
                errors: error.errors
            });
        }
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Listar todos los proyectos
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            include: {
                user: { select: { id: true, name: true, email: true } },
                Documents: true
            },
            orderBy: { created_at: 'desc' }
        });

        res.status(200).json({
            success: true,
            data: projects,
            count: projects.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Obtener proyecto por ID
exports.getProjectById = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await prisma.project.findUnique({
            where: { id: BigInt(id) },
            include: {
                user: { select: { id: true, name: true, email: true } },
                Documents: true
            }
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Proyecto no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Actualizar proyecto
exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const data = updateProjectSchema.parse(req.body);

        const projectExists = await prisma.project.findUnique({
            where: { id: BigInt(id) }
        });

        if (!projectExists) {
            return res.status(404).json({
                success: false,
                message: 'Proyecto no encontrado'
            });
        }

        const updateData = { ...data };
        if (req.file) {
            if (projectExists.document) {
                const oldFilePath = path.join(__dirname, '../../uploads', projectExists.document);
                if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
            }
            updateData.document = req.file.filename;
        }
        if (data.start_date) updateData.start_date = new Date(data.start_date);
        if (data.end_date) updateData.end_date = new Date(data.end_date);

        const project = await prisma.project.update({
            where: { id: BigInt(id) },
            data: updateData,
            include: { user: true, Documents: true }
        });

        res.status(200).json({
            success: true,
            message: 'Proyecto actualizado exitosamente',
            data: project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Eliminar proyecto
exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await prisma.project.findUnique({
            where: { id: BigInt(id) }
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Proyecto no encontrado'
            });
        }

        if (project.document) {
            const filePath = path.join(__dirname, '../../uploads', project.document);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await prisma.project.delete({
            where: { id: BigInt(id) }
        });

        res.status(200).json({
            success: true,
            message: 'Proyecto eliminado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};