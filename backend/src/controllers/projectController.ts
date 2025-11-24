import { Request, Response } from "express";
import Project from "@/models/Project";
import Task from "@/models/Task";

const getUserId = (req: Request) => (req as any).user?._id;

export const getProjects = async (req: Request, res: Response) => {
    try {
        const owner = getUserId(req);
        const projects = await Project.find({ owner }).sort({ createdAt: -1 });
        res.json({ projects });
    } catch (error) {
        console.error("[Projects:get]", error);
        res.status(500).json({ message: "Nepodarilo sa načítať projekty." });
    }
};

export const createProject = async (req: Request, res: Response) => {
    try {
        const owner = getUserId(req);
        const project = new Project({ ...req.body, owner });
        await project.save();
        res.status(201).json({ project });
    } catch (error: any) {
        if (error.code === 11000) {
            return res
                .status(409)
                .json({ message: "Projekt s týmto názvom už existuje." });
        }
        console.error("[Projects:create]", error);
        res.status(500).json({ message: "Nepodarilo sa vytvoriť projekt." });
    }
};

export const updateProject = async (req: Request, res: Response) => {
    try {
        const owner = getUserId(req);
        const { projectId } = req.params;
        const project = await Project.findOneAndUpdate(
            { _id: projectId, owner },
            req.body,
            { new: true },
        );
        if (!project) return res.status(404).json({ message: "Projekt neexistuje." });
        res.json({ project });
    } catch (error: any) {
        if (error.code === 11000) {
            return res
                .status(409)
                .json({ message: "Projekt s týmto názvom už existuje." });
        }
        console.error("[Projects:update]", error);
        res.status(500).json({ message: "Nepodarilo sa upraviť projekt." });
    }
};

export const deleteProject = async (req: Request, res: Response) => {
    try {
        const owner = getUserId(req);
        const { projectId } = req.params;
        const project = await Project.findOneAndDelete({ _id: projectId, owner });
        if (!project) return res.status(404).json({ message: "Projekt neexistuje." });
        await Task.deleteMany({ project: projectId, owner });
        res.status(204).send();
    } catch (error) {
        console.error("[Projects:delete]", error);
        res.status(500).json({ message: "Nepodarilo sa zmazať projekt." });
    }
};


