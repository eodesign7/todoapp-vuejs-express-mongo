import { Router } from "express";
import authRoutes from "./authRoutes";
import projectRoutes from "./projects";

const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/projects", projectRoutes);

export default apiRouter;

