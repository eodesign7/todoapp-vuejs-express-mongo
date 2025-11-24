import type { Document, Types } from "mongoose";

export interface UserDocument extends Document {
    email: string;
    password: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface TodoDocument extends Document {
    title: string;
    description?: string;
    completed: boolean;
    user: Types.ObjectId;
}
