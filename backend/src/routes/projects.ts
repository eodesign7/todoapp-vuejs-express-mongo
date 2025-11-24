import { Router } from "express";
import { authMiddleware } from "@/middleware/auth";
import {
    createProject,
    deleteProject,
    getProjects,
    updateProject,
} from "@/controllers/projectController";
import {
    createTask,
    deleteTask,
    getProjectTasks,
    updateTask,
} from "@/controllers/taskController";

const router = Router();

router.use(authMiddleware);

router.get("/", getProjects);
router.post("/", createProject);
router.put("/:projectId", updateProject);
router.delete("/:projectId", deleteProject);

router.get("/:projectId/tasks", getProjectTasks);
router.post("/:projectId/tasks", createTask);
router.put("/:projectId/tasks/:taskId", updateTask);
router.delete("/:projectId/tasks/:taskId", deleteTask);

export default router;


