import type { Document, Types } from "mongoose";

export interface UserDocument extends Document {
    email: string;
    password: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface ProjectDocument extends Document {
    name: string;
    description?: string;
    color?: string;
    owner: Types.ObjectId;
}

export type TaskStatus = "active" | "completed";

export interface TaskDocument extends Document {
    title: string;
    description?: string;
    status: TaskStatus;
    startTime?: Date;
    endTime?: Date;
    project: Types.ObjectId;
    owner: Types.ObjectId;
}
