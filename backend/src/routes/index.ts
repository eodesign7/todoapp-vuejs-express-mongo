import { Router } from "express";
import authRoutes from "./authRoutes";
import todoRoutes from "./todos";

const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/todos", todoRoutes);

export default apiRouter;

