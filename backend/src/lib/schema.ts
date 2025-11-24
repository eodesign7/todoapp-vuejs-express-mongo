import { Schema } from "mongoose";
import type { ProjectDocument, TaskDocument, UserDocument } from "@/lib/types";

export const UserSchema = new Schema<UserDocument>({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false,
    },
});

export const ProjectSchema = new Schema<ProjectDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120,
        },
        description: {
            type: String,
            maxlength: 500,
        },
        color: {
            type: String,
            default: "#dbeafe",
            match: /^#([0-9A-Fa-f]{3}){1,2}$/,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
    },
    { timestamps: true },
);

ProjectSchema.index({ owner: 1, name: 1 }, { unique: true });

export const TaskSchema = new Schema<TaskDocument>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 160,
        },
        description: {
            type: String,
            maxlength: 1000,
        },
        status: {
            type: String,
            enum: ["active", "completed"],
            default: "active",
            index: true,
        },
        startTime: Date,
        endTime: Date,
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
            index: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
    },
    { timestamps: true },
);

TaskSchema.index({ owner: 1, project: 1, status: 1 });
