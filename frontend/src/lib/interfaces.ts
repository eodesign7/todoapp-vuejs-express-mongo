export interface User {
    _id: string;
    email: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
}

export interface Project {
    _id: string;
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    createdAt?: string;
    updatedAt?: string;
}

export type TaskStatus = "active" | "completed";

export interface Task {
    _id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    startTime?: string;
    endTime?: string;
    project: string;
    createdAt?: string;
    updatedAt?: string;
}
