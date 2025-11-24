// cSpell: disable

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useWorkspaceStore } from "@/stores/projects";
import type { Task } from "@/lib/interfaces";
import type { ProjectFormShape, TaskFormShape } from "@/types/todoForms";
import { useRouter, useRoute } from "vue-router";
import { filterTasksByQuery, formatTaskWindow, timeStringToISO } from "@/utils/todoHelpers";
import RootLayout from "@/layout/RootLayout.vue";
import UserButton from "@/components/UserButton.vue";

const auth = useAuthStore();
const workspace = useWorkspaceStore();
const router = useRouter();
const route = useRoute();

const colorOptions = ["#dbeafe", "#ddd6fe", "#fbcfe8", "#fde68a", "#bef264", "#bfdbfe"] as const;
const defaultColor: string = colorOptions[0];

const showLists = ref(true);
const showProjectModal = ref(false);
const openTaskMenuId = ref<string | null>(null);
const searchQuery = ref("");
const showInlineComposer = ref(false);
const projectForm = reactive<ProjectFormShape>({
    name: "",
    description: "",
    color: defaultColor,
});
const taskForm = reactive<TaskFormShape>({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
});
const accentColor = computed(() => workspace.activeProject?.color ?? "#d4d4d8");
const activeProjectName = computed(() => workspace.activeProject?.name ?? "Select a list");
const activeProjectDescription = computed(
    () => workspace.activeProject?.description || "Vyber si niektorý zoznam",
);

const currentTasksLoading = computed(() => {
    const id = workspace.activeProjectId;
    if (!id) return false;
    return workspace.loadingTasks[id] ?? false;
});

const tasksByTab = computed(() => workspace.tasksByStatus);

const orderedTasks = computed(() => [
    ...tasksByTab.value.active,
    ...tasksByTab.value.completed,
]);

const visibleTasks = computed(() => filterTasksByQuery(orderedTasks.value, searchQuery.value));

const loadData = async () => {
    if (!auth.user && auth.token) {
        await auth.fetchMe();
    }
    await workspace.fetchProjects();
};

const ensureTasks = async (projectId: string | null) => {
    if (!projectId) return;
    if (!workspace.tasks[projectId]) {
        await workspace.fetchTasks(projectId);
    }
};

const closeMenus = () => {
    openTaskMenuId.value = null;
};

onMounted(async () => {
    await loadData();
    await ensureTasks(workspace.activeProjectId);
    document.addEventListener("click", closeMenus);
});

onBeforeUnmount(() => {
    document.removeEventListener("click", closeMenus);
});

watch(
    () => workspace.activeProjectId,
    async (id) => {
        await ensureTasks(id);
    },
);

const resetProjectForm = () => {
    projectForm.name = "";
    projectForm.description = "";
    projectForm.color = defaultColor;
};

const resetTaskForm = () => {
    taskForm.title = "";
    taskForm.description = "";
    taskForm.startTime = "";
    taskForm.endTime = "";
};

const handleCreateProject = async () => {
    if (!projectForm.name.trim()) return;
    await workspace.createProject({
        name: projectForm.name.trim(),
        description: projectForm.description.trim() || undefined,
        color: projectForm.color,
    });
    showProjectModal.value = false;
    resetProjectForm();
};

const handleCreateTask = async () => {
    const projectId = workspace.activeProjectId;
    if (!projectId || !taskForm.title.trim()) return;
    await workspace.createTask(projectId, {
        title: taskForm.title.trim(),
        description: taskForm.description.trim() || undefined,
        startTime: timeStringToISO(taskForm.startTime),
        endTime: timeStringToISO(taskForm.endTime),
    });
    resetTaskForm();
};

const handleSelectProject = (id: string) => {
    workspace.setActiveProject(id);
};

const toggleTaskMenu = (id: string, event?: MouseEvent) => {
    event?.stopPropagation();
    openTaskMenuId.value = openTaskMenuId.value === id ? null : id;
};

const handleToggleTask = async (task: Task) => {
    if (!workspace.activeProjectId) return;
    const next = task.status === "active" ? "completed" : "active";
    await workspace.toggleTaskStatus(workspace.activeProjectId, task._id, next);
    openTaskMenuId.value = null;
};

const handleDeleteTask = async (task: Task) => {
    if (!workspace.activeProjectId) return;
    await workspace.deleteTask(workspace.activeProjectId, task._id);
    openTaskMenuId.value = null;
};

const handleDeleteProject = async (projectId: string) => {
    if (!projectId) return;
    await workspace.deleteProject(projectId);
};

const handleLogout = () => {
    auth.logout();
    router.push({ name: "Login" });
};

const goTo = (name: string) => router.push({ name });

const toggleInlineComposer = () => {
    showInlineComposer.value = !showInlineComposer.value;
    if (!showInlineComposer.value) resetTaskForm();
};

const submitInlineTask = async () => {
    if (!taskForm.title.trim()) return;
    await handleCreateTask();
    showInlineComposer.value = false;
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

                <div class="lists-header" @click="showLists = !showLists">
                    <span>My Todo Lists</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                        <path d="M6 9l6 6 6-6" :fill="showLists ? '#4b5563' : '#9ca3af'"></path>
                    </svg>
                </div>

                <transition name="fade">
                    <div v-if="showLists" class="list-stack">
                        <div v-for="project in workspace.projects" :key="project._id"
                            :class="['list-item', { active: project._id === workspace.activeProjectId }]" role="button"
                            tabindex="0" @click="handleSelectProject(project._id)"
                            @keydown.enter.prevent="handleSelectProject(project._id)">
                            <span class="dot" :style="{ background: project.color }" />
                            <div>
                                <p>{{ project.name }}</p>
                                <small>{{ project.description || "Bez popisu" }}</small>
                            </div>
                            <button class="ghost" @click.stop="handleDeleteProject(project._id)">
                                <span aria-hidden="true">⋯</span>
                            </button>
                        </div>
                        <button class="ghost create" @click="showProjectModal = true">+ Add Project</button>
                    </div>
                </transition>

                <UserButton :email="auth.user?.email || 'anonym'" @logout="handleLogout" />
            </div>
        </template>

        <section class="board" :style="{ '--accent-color': accentColor }">
            <header class="board-header">
                <div>
                    <p class="eyebrow">Aktuálny zoznam</p>
                    <h1>{{ activeProjectName }}</h1>
                    <small class="list-description">{{ activeProjectDescription }}</small>
                </div>

                <div class="board-actions">
                    <div class="search-field">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                            <path
                                d="M15.5 14h-.79l-.28-.27a6 6 0 10-.7.7l.27.28v.79L20 20.49 21.49 19 15.5 14z"
                                fill="#9ca3af" />
                        </svg>
                        <input v-model="searchQuery" type="text" placeholder="Search task" />
                    </div>
                </div>
            </header>

            <div v-if="workspace.error" class="error-banner">{{ workspace.error }}</div>

            <div v-if="currentTasksLoading" class="loading">
                Načítavam...
            </div>

            <div v-else class="task-list">
                <div v-if="workspace.activeProjectId" class="task-row add-row">
                    <div v-if="!showInlineComposer" class="add-row-collapsed">
                        <button type="button" class="add-trigger" @click="toggleInlineComposer">
                            <span class="add-dot">+</span>
                            <span>Pridať úlohu</span>
                        </button>
                    </div>
                    <form v-else class="inline-composer" @submit.prevent="submitInlineTask">
                        <input v-model="taskForm.title" placeholder="What needs to be done?" />
                        <input v-model="taskForm.startTime" type="time" />
                        <input v-model="taskForm.endTime" type="time" />
                        <input v-model="taskForm.description" placeholder="Short note (optional)" />
                        <button type="submit" class="primary">Add Task</button>
                        <button type="button" class="ghost" @click="toggleInlineComposer">Cancel</button>
                    </form>
                </div>
                <article v-for="task in visibleTasks" :key="task._id" class="task-row">
                    <div class="task-left">
                        <span class="status-dot" :class="task.status" />
                        <div class="task-info">
                            <strong>{{ task.title }}</strong>
                            <span class="meta">
                                {{ task.description || "Bez popisu" }} · {{ formatTaskWindow(task) }}
                            </span>
                        </div>
                    </div>
                    <div class="task-menu" @click.stop>
                        <button class="ghost" aria-label="Akcie" @click="toggleTaskMenu(task._id, $event)">
                            ⋮
                        </button>
                        <div v-if="openTaskMenuId === task._id" class="dropdown dark">
                            <button type="button" @click="handleToggleTask(task)">
                                {{ task.status === "active" ? "Označiť hotové" : "Vrátiť späť" }}
                            </button>
                            <button type="button" class="danger" @click="handleDeleteTask(task)">
                                Zmazať úlohu
                            </button>
                        </div>
                    </div>
                </article>
                <div v-if="!visibleTasks.length && !showInlineComposer" class="empty-hint">
                    Žiadne úlohy v tejto sekcii. Pridaj novú.
                </div>
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
    cursor: pointer;
}

.list-stack {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.list-item {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 10px;
    padding: 8px 4px;
    border-bottom: 1px solid #f1f5f9;
    align-items: center;
    cursor: pointer;
}

.list-item:last-child {
    border-bottom: none;
}

.list-item.active {
    border-bottom: 1px solid var(--accent-color, #d4d4d8);
}

.list-item p {
    margin: 0;
    font-weight: 600;
    color: #0f172a;
}

.list-item small {
    color: #94a3b8;
}

.dot {
    width: 18px;
    height: 18px;
    border-radius: 6px;
}

.ghost {
    background: transparent;
    border: none;
    color: #374151;
    cursor: pointer;
    font-size: 1.1rem;
}

.ghost.icon {
    font-size: 1.4rem;
}

.ghost.create {
    justify-self: start;
    font-size: 0.95rem;
    color: #111827;
}

.list-item .ghost {
    color: #0f172a;
}

.dropdown {
    position: absolute;
    top: 32px;
    right: 0;
    background: #fff;
    border: 1px solid #1f2937;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    min-width: 160px;
    z-index: 20;
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.15);
}

.dropdown.dark {
    background: #111827;
    border-color: #111827;
}

.dropdown button {
    border: none;
    background: transparent;
    padding: 10px 14px;
    text-align: left;
    font-size: 0.9rem;
    color: #1f2937;
    cursor: pointer;
}

.dropdown.dark button {
    color: #f8fafc;
}

.dropdown button:hover {
    background: #f3f4f6;
}

.dropdown.dark button:hover {
    background: rgba(255, 255, 255, 0.08);
}

.dropdown button.danger {
    color: #b91c1c;
}

.dropdown.dark button.danger {
    color: #fca5a5;
}

.board {
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

.board-header h1 {
    margin: 4px 0 4px;
    font-size: 1.8rem;
    color: #030712;
}

.list-description {
    color: #6b7280;
    font-size: 0.9rem;
}

.board-actions {
    display: flex;
    gap: 16px;
    align-items: center;
}

.search-field {
    background: #fff;
    border-radius: 14px;
    padding: 10px 14px;
    border: 1px solid #d4d4d8;
    display: flex;
    align-items: center;
    gap: 8px;
}

.search-field input {
    border: none;
    outline: none;
    font-size: 0.95rem;
}

.primary {
    background: var(--accent-color, #d4d4d8);
    color: #111827;
    border: 1px solid #d4d4d8;
    padding: 11px 20px;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
}


.task-list {
    display: flex;
    flex-direction: column;
    background: transparent;
    border: none;
    border-radius: 0;
}

.task-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 0;
    border-bottom: 1px solid #eceff3;
    gap: 16px;
}

.task-row:last-child {
    border-bottom: none;
}

.task-left {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
}

.task-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
}

.task-info strong {
    font-size: 1rem;
    color: #0f172a;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.task-info .meta {
    font-size: 0.85rem;
    color: #6b7280;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.task-menu {
    position: relative;
}

.status-dot {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    background: var(--accent-color, #d4d4d8);
}

.status-dot.completed {
    opacity: 0.4;
}

.empty-hint {
    padding: 28px 0;
    text-align: center;
    color: #94a3b8;
}

.add-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
}

.add-row-collapsed {
    width: 100%;
}

.add-trigger {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    border: none;
    background: transparent;
    font-size: 0.95rem;
    font-weight: 600;
    color: #0f172a;
    cursor: pointer;
}

.add-dot {
    width: 28px;
    height: 28px;
    border-radius: 999px;
    border: 1px dashed #cbd5f5;
    display: grid;
    place-items: center;
    font-weight: 600;
}

.inline-composer {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr)) auto auto;
    gap: 12px;
    align-items: center;
}

.inline-composer input {
    border: none;
    border-radius: 0;
    padding: 6px 8px;
    font-size: 0.95rem;
    background: rgba(15, 23, 42, 0.04);
    transition: background 0.2s ease, color 0.2s ease;
}

.inline-composer input:focus {
    outline: none;
    background: rgba(15, 23, 42, 0.08);
    color: #0f172a;
}

.inline-composer input::placeholder {
    color: #94a3b8;
}

.inline-composer .primary {
    padding: 8px 16px;
}

.inline-composer .ghost {
    padding: 8px 12px;
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

.error-banner {
    background: #fef2f2;
    color: #b91c1c;
    padding: 12px 16px;
    border-radius: 12px;
}

.loading {
    padding: 20px;
    color: #6b7280;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@media (max-width: 1024px) {
.sidebar {
        flex-direction: row;
        overflow-x: auto;
    }
}
</style>
