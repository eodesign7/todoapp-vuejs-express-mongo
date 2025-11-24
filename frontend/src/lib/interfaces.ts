export interface User {
    _id: string;
    email: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
}

export interface Todo {
    _id: string;
    title: string;
    description?: string;
    completed: boolean;
    createdAt?: string;
    updatedAt?: string;
}
