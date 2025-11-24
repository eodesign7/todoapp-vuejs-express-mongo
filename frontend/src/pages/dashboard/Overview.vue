<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useWorkspaceStore } from "@/stores/projects";
import { useAuthStore } from "@/stores/auth";
import RootLayout from "@/layout/RootLayout.vue";
import UserButton from "@/components/UserButton.vue";
import type { ProjectFormShape } from "@/types/todoForms";

const workspace = useWorkspaceStore();
const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const colorOptions = ["#dbeafe", "#ddd6fe", "#fbcfe8", "#fde68a", "#bef264", "#bfdbfe"] as const;
const defaultColor: string = colorOptions[0];

const quickTask = reactive<Record<string, string>>({});
const quickLoading = reactive<Record<string, boolean>>({});
const showProjectModal = ref(false);
const projectForm = reactive<ProjectFormShape>({
    name: "",
    description: "",
    color: defaultColor,
});

const loadData = async () => {
    if (!auth.user && auth.token) {
        await auth.fetchMe();
    }
    await workspace.fetchProjects();
};

onMounted(loadData);

const goTo = (name: string) => router.push({ name });

const openProject = (projectId: string) => {
    workspace.setActiveProject(projectId);
    router.push({ name: "Todos" });
};

const ensureTasks = async (projectId: string) => {
    if (!workspace.tasks[projectId]) {
        await workspace.fetchTasks(projectId);
    }
};

const projectStats = (projectId: string) => {
    const list = workspace.tasks[projectId];
    if (!list) return null;
    const active = list.filter((task) => task.status === "active").length;
    return {
        active,
        done: list.length - active,
    };
};

const handleQuickAdd = async (projectId: string) => {
    const title = quickTask[projectId]?.trim();
    if (!title) return;
    quickLoading[projectId] = true;
    try {
        await workspace.createTask(projectId, { title });
        quickTask[projectId] = "";
        await workspace.fetchTasks(projectId);
    } finally {
        quickLoading[projectId] = false;
    }
};

const resetProjectForm = () => {
    projectForm.name = "";
    projectForm.description = "";
    projectForm.color = defaultColor;
};

const handleCreateProject = async () => {
    if (!projectForm.name.trim()) return;
    try {
        await workspace.createProject({
            name: projectForm.name.trim(),
            description: projectForm.description.trim() || undefined,
            color: projectForm.color,
        });
        resetProjectForm();
        showProjectModal.value = false;
    } catch {
        // error already handled in store
    }
};

const handleLogout = () => {
    auth.logout();
    router.push({ name: "Login" });
};
</script>

<template>
    <RootLayout>
        <template #sidebar>
            <div class="sidebar">
                <div class="logo-block">
                    <div class="logo-dot">✸</div>
                    <div>
                        <p class="eyebrow">HealDocs</p>
                        <strong>Todo List</strong>
                    </div>
                </div>

                <nav class="sidebar-nav">
                    <p>Navigation</p>
                    <ul>
                        <li :class="{ active: route.name === 'Overview' }" @click="goTo('Overview')">
                            Overview
                        </li>
                        <li :class="{ active: route.name === 'Todos' }" @click="goTo('Todos')">
                            Todo List
                        </li>
                    </ul>
                </nav>

                <div class="lists-header">
                    <span>My Todo Lists</span>
                    <span class="count-pill">{{ workspace.projects.length }}</span>
                </div>

                <UserButton :email="auth.user?.email || 'anonym'" @logout="handleLogout" />
            </div>
        </template>

        <section class="overview-board">
            <header class="board-header">
                <div>
                    <p class="eyebrow">Dashboard</p>
                    <h1>Overview</h1>
                </div>
                <div class="header-actions">
                    <button class="ghost" @click="goTo('Todos')">Open Workspace</button>
                    <button class="primary" @click="showProjectModal = true">+ New List</button>
                </div>
            </header>

            <div v-if="workspace.loadingProjects" class="loading">Načítavam projekty...</div>

            <div v-else class="grid">
                <article v-for="project in workspace.projects" :key="project._id" class="project-card"
                    @mouseenter="ensureTasks(project._id)">
                    <header>
                        <div class="card-title">
                            <span class="dot" :style="{ background: project.color }" />
                            <div>
                                <h3>{{ project.name }}</h3>
                                <small>{{ project.description || "Bez popisu" }}</small>
                            </div>
                        </div>
                        <button class="ghost" @click="openProject(project._id)">↗</button>
                    </header>

                    <div class="stats">
                        <template v-if="projectStats(project._id)">
                            <span>Active: {{ projectStats(project._id)?.active }}</span>
                            <span>Done: {{ projectStats(project._id)?.done }}</span>
                        </template>
                        <template v-else>
                            <span>Active: —</span>
                            <span>Done: —</span>
                        </template>
                    </div>

                    <div class="quick-task">
                        <input v-model="quickTask[project._id]" placeholder="Quick add (title only)" />
                        <button class="primary" :disabled="quickLoading[project._id]" @click="handleQuickAdd(project._id)">
                            {{ quickLoading[project._id] ? "Adding..." : "Add" }}
                        </button>
                    </div>

                    <div class="actions">
                        <button class="ghost" @click="openProject(project._id)">Open List</button>
                        <button class="ghost" @click="ensureTasks(project._id)">Sync Stats</button>
                    </div>
                </article>

                <article v-if="!workspace.projects.length" class="empty-card">
                    <p>Zatiaľ nemáš žiadne listy.</p>
                    <button class="primary" @click="goTo('Todos')">Vytvoriť prvý</button>
                </article>
            </div>
        </section>

        <div v-if="showProjectModal" class="modal-backdrop">
            <div class="modal">
                <header>
                    <h3>New Todo List</h3>
                    <button class="ghost" @click="showProjectModal = false">✕</button>
                </header>
                <label>
                    Názov
                    <input v-model="projectForm.name" placeholder="Napr. Marketing Sync" />
                </label>
                <label>
                    Popis
                    <textarea v-model="projectForm.description" rows="3" placeholder="Krátka anotácia"></textarea>
                </label>
                <label>
                    Farba
                    <div class="color-palette">
                        <button v-for="color in colorOptions" :key="color"
                            :class="['color-dot', { active: projectForm.color === color }]"
                            :style="{ background: color }" @click="projectForm.color = color"></button>
                    </div>
                </label>
                <div class="modal-actions">
                    <button class="ghost" @click="showProjectModal = false">Zrušiť</button>
                    <button class="primary" @click="handleCreateProject">Vytvoriť</button>
                </div>
            </div>
        </div>
    </RootLayout>
</template>

<style scoped>
.sidebar {
    background: #f5f5f4;
    border-right: 1px solid #e4e4e7;
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.logo-block {
    display: flex;
    align-items: center;
    gap: 12px;
}

.logo-dot {
    width: 44px;
    height: 44px;
    border-radius: 16px;
    background: #111827;
    display: grid;
    place-items: center;
    color: #fff;
    font-weight: 600;
    font-size: 1.1rem;
}

.eyebrow {
    text-transform: uppercase;
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    color: #94a3b8;
    margin: 0;
}

.sidebar-nav ul {
    list-style: none;
    padding: 0;
    margin: 12px 0 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.sidebar-nav li {
    padding: 10px 12px;
    border-radius: 10px;
    color: #4b5563;
    font-size: 0.95rem;
    cursor: pointer;
}

.sidebar-nav li.active {
    background: #e4e4e7;
    color: #111827;
    font-weight: 600;
}

.lists-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
    color: #0f172a;
}

.count-pill {
    padding: 2px 10px;
    border-radius: 999px;
    background: #e7e5e4;
    font-size: 0.8rem;
}

.overview-board {
    padding: 40px;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.board-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-actions {
    display: flex;
    gap: 12px;
    align-items: center;
}

.primary {
    background: #111827;
    color: #fff;
    border: none;
    padding: 11px 20px;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 20px;
}

.project-card {
    border: 1px solid #e4e4e7;
    border-radius: 16px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: #fff;
}

.project-card header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.card-title {
    display: flex;
    gap: 12px;
}

.dot {
    width: 16px;
    height: 16px;
    border-radius: 6px;
}

.project-card h3 {
    margin: 0;
    font-size: 1.1rem;
}

.project-card small {
    color: #94a3b8;
}

.ghost {
    background: transparent;
    border: none;
    color: #4b5563;
    cursor: pointer;
    font-size: 0.95rem;
}

.stats {
    display: flex;
    gap: 16px;
    font-size: 0.9rem;
    color: #6b7280;
}

.quick-task {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 10px;
    width: 100%;
}

.quick-task input {
    width: 100%;
    border: 1px solid #e5e7eb;
    border-radius: 999px;
    padding: 8px 14px;
    font-size: 0.9rem;
    min-width: 0;
}

.actions {
    display: flex;
    gap: 12px;
}

.empty-card {
    border: 1px dashed #cbd5f5;
    border-radius: 16px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    color: #6b7280;
}

.loading {
    padding: 40px;
    color: #6b7280;
}

.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.45);
    display: grid;
    place-items: center;
    padding: 24px;
    z-index: 20;
}

.modal {
    background: #fff;
    border-radius: 20px;
    padding: 24px;
    width: min(420px, calc(100vw - 48px));
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-sizing: border-box;
}

.modal header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal input,
.modal textarea {
    width: 100%;
    max-width: 100%;
    border: 1px solid #d4d4d8;
    border-radius: 12px;
    padding: 10px 12px;
    font-size: 0.95rem;
    font-family: inherit;
    box-sizing: border-box;
    display: block;
}

.color-palette {
    display: flex;
    gap: 8px;
    margin-top: 8px;
}

.color-dot {
    width: 32px;
    height: 32px;
    border-radius: 12px;
    border: 2px solid transparent;
    cursor: pointer;
}

.color-dot.active {
    border-color: #111827;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

@media (max-width: 1024px) {
    .sidebar {
        flex-direction: row;
        overflow-x: auto;
    }

    .overview-board {
        padding: 24px;
    }
}
</style>

