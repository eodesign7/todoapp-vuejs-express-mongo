import { defineStore } from "pinia";
import api from "@/lib/api";
import type { Project, Task, TaskStatus } from "@/lib/interfaces";

interface LoadingMap {
    [projectId: string]: boolean;
}

interface WorkspaceState {
    projects: Project[];
    tasks: Record<string, Task[]>;
    activeProjectId: string | null;
    loadingProjects: boolean;
    loadingTasks: LoadingMap;
    error: string | null;
}

export const useWorkspaceStore = defineStore("workspace", {
    state: (): WorkspaceState => ({
        projects: [],
        tasks: {},
        activeProjectId: null,
        loadingProjects: false,
        loadingTasks: {},
        error: null,
    }),
    getters: {
        activeProject(state) {
            return state.projects.find((project) => project._id === state.activeProjectId) ?? null;
        },
        activeTasks(state) {
            if (!state.activeProjectId) return [];
            return state.tasks[state.activeProjectId] ?? [];
        },
        tasksByStatus(state) {
            if (!state.activeProjectId) return { active: [] as Task[], completed: [] as Task[] };
            const projectTasks = state.tasks[state.activeProjectId] ?? [];
            return {
                active: projectTasks.filter((task) => task.status === "active"),
                completed: projectTasks.filter((task) => task.status === "completed"),
            };
        },
    },
    actions: {
        setError(message: string | null) {
            this.error = message;
        },
        setActiveProject(projectId: string | null) {
            this.activeProjectId = projectId;
        },
        async fetchProjects() {
            this.loadingProjects = true;
            this.error = null;
            try {
                const { data } = await api.get("/projects");
                this.projects = data.projects;
                if (!this.activeProjectId && data.projects.length) {
                    this.activeProjectId = data.projects[0]._id;
                } else if (
                    this.activeProjectId &&
                    !data.projects.find((project: Project) => project._id === this.activeProjectId)
                ) {
                    this.activeProjectId = data.projects[0]?._id ?? null;
                }
            } catch (error: any) {
                this.error =
                    error?.response?.data?.message ?? "Nepodarilo sa načítať projekty.";
            } finally {
                this.loadingProjects = false;
            }
        },
        async fetchTasks(projectId: string) {
            if (!projectId) return;
            this.loadingTasks[projectId] = true;
            try {
                const { data } = await api.get(`/projects/${projectId}/tasks`);
                this.tasks[projectId] = data.tasks;
            } catch (error: any) {
                this.error =
                    error?.response?.data?.message ?? "Nepodarilo sa načítať úlohy projektu.";
            } finally {
                this.loadingTasks[projectId] = false;
            }
        },
        async createProject(payload: { name: string; description?: string; color?: string; icon?: string }) {
            try {
                const { data } = await api.post("/projects", payload);
                this.projects.unshift(data.project);
                this.activeProjectId = data.project._id;
                this.tasks[data.project._id] = [];
                return data.project as Project;
            } catch (error: any) {
                this.error =
                    error?.response?.data?.message ?? "Projekt sa nepodarilo vytvoriť.";
                throw error;
            }
        },
        async updateProject(projectId: string, payload: Partial<Project>) {
            try {
                const { data } = await api.put(`/projects/${projectId}`, payload);
                this.projects = this.projects.map((project) =>
                    project._id === projectId ? data.project : project,
                );
            } catch (error: any) {
                this.error =
                    error?.response?.data?.message ?? "Projekt sa nepodarilo upraviť.";
                throw error;
            }
        },
        async deleteProject(projectId: string) {
            const backupProjects = [...this.projects];
            const backupTasks = { ...this.tasks };
            this.projects = this.projects.filter((project) => project._id !== projectId);
            delete this.tasks[projectId];
            if (this.activeProjectId === projectId) {
                this.activeProjectId = this.projects[0]?._id ?? null;
            }
            try {
                await api.delete(`/projects/${projectId}`);
            } catch (error: any) {
                this.projects = backupProjects;
                this.tasks = backupTasks;
                this.error =
                    error?.response?.data?.message ?? "Projekt sa nepodarilo zmazať.";
                throw error;
            }
        },
        async createTask(
            projectId: string,
            payload: {
                title: string;
                description?: string;
                startTime?: string | null;
                endTime?: string | null;
            },
        ) {
            try {
                const { data } = await api.post(`/projects/${projectId}/tasks`, payload);
                this.tasks[projectId] = [data.task, ...(this.tasks[projectId] ?? [])];
                return data.task as Task;
            } catch (error: any) {
                this.error =
                    error?.response?.data?.message ?? "Úlohu sa nepodarilo vytvoriť.";
                throw error;
            }
        },
        async updateTask(
            projectId: string,
            taskId: string,
            payload: Partial<Omit<Task, "_id" | "project">>,
        ) {
            try {
                const { data } = await api.put(
                    `/projects/${projectId}/tasks/${taskId}`,
                    payload,
                );
                this.tasks[projectId] = (this.tasks[projectId] ?? []).map((task) =>
                    task._id === taskId ? data.task : task,
                );
            } catch (error: any) {
                this.error =
                    error?.response?.data?.message ?? "Úlohu sa nepodarilo upraviť.";
                throw error;
            }
        },
        async deleteTask(projectId: string, taskId: string) {
            const backup = [...(this.tasks[projectId] ?? [])];
            this.tasks[projectId] = backup.filter((task) => task._id !== taskId);
            try {
                await api.delete(`/projects/${projectId}/tasks/${taskId}`);
            } catch (error: any) {
                this.tasks[projectId] = backup;
                this.error =
                    error?.response?.data?.message ?? "Úlohu sa nepodarilo zmazať.";
                throw error;
            }
        },
        async toggleTaskStatus(projectId: string, taskId: string, status: TaskStatus) {
            await this.updateTask(projectId, taskId, { status });
        },
    },
});


