import mongoose from "mongoose";
import { TaskSchema } from "@/lib/schema";
import type { TaskDocument } from "@/lib/types";

const Task =
    mongoose.models.Task
        ? (mongoose.models.Task as mongoose.Model<TaskDocument>)
        : mongoose.model<TaskDocument>("Task", TaskSchema);

export default Task;


