import { Request, Response } from "express";
import Project from "@/models/Project";
import Task from "@/models/Task";

const getUserId = (req: Request) => (req as any).user?._id;

const ensureProject = async (projectId: string, owner: string) => {
    const project = await Project.findOne({ _id: projectId, owner });
    if (!project) {
        const error = new Error("Projekt neexistuje.");
        (error as any).status = 404;
        throw error;
    }
};

export const getProjectTasks = async (req: Request, res: Response) => {
    try {
        const owner = getUserId(req);
        const { projectId } = req.params;
        await ensureProject(projectId, owner);
        const tasks = await Task.find({ project: projectId, owner }).sort({
            status: 1,
            createdAt: -1,
        });
        res.json({ tasks });
    } catch (error: any) {
        if (error.status === 404) {
            return res.status(404).json({ message: error.message });
        }
        console.error("[Tasks:get]", error);
        res.status(500).json({ message: "Nepodarilo sa načítať úlohy." });
    }
};

export const createTask = async (req: Request, res: Response) => {
    try {
        const owner = getUserId(req);
        const { projectId } = req.params;
        await ensureProject(projectId, owner);
        const task = new Task({ ...req.body, project: projectId, owner });
        await task.save();
        res.status(201).json({ task });
    } catch (error: any) {
        if (error.status === 404) {
            return res.status(404).json({ message: error.message });
        }
        console.error("[Tasks:create]", error);
        res.status(500).json({ message: "Nepodarilo sa vytvoriť úlohu." });
    }
};

export const updateTask = async (req: Request, res: Response) => {
    try {
        const owner = getUserId(req);
        const { projectId, taskId } = req.params;
        await ensureProject(projectId, owner);
        const task = await Task.findOneAndUpdate(
            { _id: taskId, owner, project: projectId },
            req.body,
            { new: true },
        );
        if (!task) return res.status(404).json({ message: "Úloha neexistuje." });
        res.json({ task });
    } catch (error: any) {
        if (error.status === 404) {
            return res.status(404).json({ message: error.message });
        }
        console.error("[Tasks:update]", error);
        res.status(500).json({ message: "Nepodarilo sa upraviť úlohu." });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const owner = getUserId(req);
        const { projectId, taskId } = req.params;
        await ensureProject(projectId, owner);
        const task = await Task.findOneAndDelete({
            _id: taskId,
            owner,
            project: projectId,
        });
        if (!task) return res.status(404).json({ message: "Úloha neexistuje." });
        res.status(204).send();
    } catch (error: any) {
        if (error.status === 404) {
            return res.status(404).json({ message: error.message });
        }
        console.error("[Tasks:delete]", error);
        res.status(500).json({ message: "Nepodarilo sa zmazať úlohu." });
    }
};


