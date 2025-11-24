import mongoose from "mongoose";
import { ProjectSchema } from "@/lib/schema";
import type { ProjectDocument } from "@/lib/types";

const Project =
    mongoose.models.Project
        ? (mongoose.models.Project as mongoose.Model<ProjectDocument>)
        : mongoose.model<ProjectDocument>("Project", ProjectSchema);

export default Project;


