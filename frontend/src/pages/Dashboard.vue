<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useWorkspaceStore } from "@/stores/projects";
import type { Task } from "@/lib/interfaces";
import AppLayout from "@/layout/AppLayout.vue";
import ListItem from "@/components/ListItem.vue";

const auth = useAuthStore();
const workspace = useWorkspaceStore();

const searchQuery = ref("");
const showNewListInput = ref(false);
const newListName = ref("");
const selectedIcon = ref("📋");
const showIconPicker = ref(false);
const newListInputRef = ref<HTMLInputElement | null>(null);

const iconOptions = [
    "📋", "📝", "✅", "📌", "🎯", "💼", 
    "🏠", "🛒", "💪", "📚", "🎨", "🎮",
    "🚀", "💡", "⭐", "❤️", "🔥", "🌟"
];

const colorOptions = ["#dbeafe", "#ddd6fe", "#fbcfe8", "#fde68a", "#bef264", "#bfdbfe"] as const;

const filteredLists = computed(() => {
    if (!searchQuery.value.trim()) return workspace.projects;
    const q = searchQuery.value.toLowerCase();
    return workspace.projects.filter((list) => {
        const matchName = list.name.toLowerCase().includes(q);
        const matchDesc = list.description?.toLowerCase().includes(q);
        const tasks = workspace.tasks[list._id] ?? [];
        const matchTask = tasks.some((t) => t.title.toLowerCase().includes(q));
        return matchName || matchDesc || matchTask;
    });
});

const getTasksForList = (listId: string): Task[] => {
    const tasks = workspace.tasks[listId] ?? [];
    if (!searchQuery.value.trim()) return tasks;
    const q = searchQuery.value.toLowerCase();
    return tasks.filter((t) => t.title.toLowerCase().includes(q));
};

const isListLoading = (listId: string) => workspace.loadingTasks[listId] ?? false;

const loadData = async () => {
    if (!auth.user && auth.token) {
        await auth.fetchMe();
    }
    await workspace.fetchProjects();
};

const ensureTasks = async (projectId: string) => {
    if (!workspace.tasks[projectId]) {
        await workspace.fetchTasks(projectId);
    }
};

onMounted(loadData);

const handleListToggle = async (listId: string) => {
    await ensureTasks(listId);
};

const handleAddTodo = async (listId: string, title: string) => {
    await workspace.createTask(listId, { title });
};

const handleToggleTask = async (listId: string, task: Task) => {
    const next = task.status === "active" ? "completed" : "active";
    await workspace.toggleTaskStatus(listId, task._id, next);
};

const handleDeleteTask = async (listId: string, task: Task) => {
    await workspace.deleteTask(listId, task._id);
};

const handleDeleteList = async (listId: string) => {
    if (confirm("Naozaj chceš zmazať tento zoznam?")) {
        await workspace.deleteProject(listId);
    }
};

const openNewListInput = () => {
    showNewListInput.value = true;
    selectedIcon.value = iconOptions[Math.floor(Math.random() * iconOptions.length)];
    setTimeout(() => newListInputRef.value?.focus(), 50);
};

const selectIcon = (icon: string) => {
    selectedIcon.value = icon;
    showIconPicker.value = false;
};

const handleCreateList = async () => {
    const name = newListName.value.trim();
    if (!name) return;
    
    const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    await workspace.createProject({ 
        name, 
        color: randomColor,
        icon: selectedIcon.value 
    });
    
    newListName.value = "";
    selectedIcon.value = "📋";
    showNewListInput.value = false;
    showIconPicker.value = false;
};

const handleNewListKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
        handleCreateList();
    } else if (e.key === "Escape") {
        showNewListInput.value = false;
        showIconPicker.value = false;
        newListName.value = "";
    }
};

const cancelNewList = () => {
    showNewListInput.value = false;
    showIconPicker.value = false;
    newListName.value = "";
};
</script>

<template>
    <AppLayout 
        v-model:search-query="searchQuery"
        @quick-add="openNewListInput"
    >
        <div class="dashboard">
            <div v-if="workspace.error" class="error-banner">
                {{ workspace.error }}
            </div>

            <div v-if="workspace.loadingProjects" class="loading">
                Načítavam zoznamy...
            </div>

            <div v-else class="lists-container">
                <ListItem
                    v-for="list in filteredLists"
                    :key="list._id"
                    :list="list"
                    :tasks="getTasksForList(list._id)"
                    :is-loading="isListLoading(list._id)"
                    @toggle="handleListToggle(list._id)"
                    @add-todo="handleAddTodo(list._id, $event)"
                    @toggle-task="handleToggleTask(list._id, $event)"
                    @delete-task="handleDeleteTask(list._id, $event)"
                    @delete-list="handleDeleteList(list._id)"
                />

                <div v-if="!filteredLists.length && !showNewListInput" class="empty-state">
                    <div class="empty-icon">📝</div>
                    <h3>Žiadne zoznamy</h3>
                    <p>Vytvor si prvý zoznam úloh kliknutím na + v hlavičke.</p>
                </div>

                <div v-if="showNewListInput" class="new-list-card">
                    <div class="new-list-header">
                        <div class="icon-picker-wrapper">
                            <button 
                                class="selected-icon" 
                                @click="showIconPicker = !showIconPicker"
                                type="button"
                            >
                                {{ selectedIcon }}
                            </button>
                            <div v-if="showIconPicker" class="icon-picker">
                                <button
                                    v-for="icon in iconOptions"
                                    :key="icon"
                                    class="icon-option"
                                    :class="{ active: selectedIcon === icon }"
                                    @click="selectIcon(icon)"
                                    type="button"
                                >
                                    {{ icon }}
                                </button>
                            </div>
                        </div>
                        <input
                            ref="newListInputRef"
                            v-model="newListName"
                            type="text"
                            placeholder="Názov zoznamu..."
                            class="new-list-input"
                            @keydown="handleNewListKeydown"
                        />
                    </div>
                    <div class="new-list-actions">
                        <button class="cancel-btn" @click="cancelNewList">
                            Zrušiť
                        </button>
                        <button 
                            class="create-btn" 
                            :disabled="!newListName.trim()"
                            @click="handleCreateList"
                        >
                            Vytvoriť
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<style scoped>
.dashboard {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.error-banner {
    background: #fef2f2;
    color: #dc2626;
    padding: 14px 18px;
    border-radius: 16px;
    font-size: 0.9rem;
}

.loading {
    padding: 40px;
    text-align: center;
    color: #6b7280;
}

.lists-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #6b7280;
}

.empty-icon {
    font-size: 3rem;
    margin-bottom: 16px;
}

.empty-state h3 {
    margin: 0 0 8px;
    color: #374151;
    font-size: 1.2rem;
}

.empty-state p {
    margin: 0;
    font-size: 0.95rem;
}

.new-list-card {
    background: #fff;
    border-radius: 20px;
    border: 2px solid #111827;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.new-list-header {
    display: flex;
    align-items: center;
    gap: 14px;
}

.icon-picker-wrapper {
    position: relative;
}

.selected-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #f3f4f6;
    border: 2px solid #e5e7eb;
    font-size: 1.4rem;
    cursor: pointer;
    display: grid;
    place-items: center;
    transition: all 0.2s;
}

.selected-icon:hover {
    border-color: #111827;
    background: #fff;
}

.icon-picker {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 8px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 12px;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 4px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    z-index: 10;
}

.icon-option {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    border: none;
    background: transparent;
    font-size: 1.2rem;
    cursor: pointer;
    display: grid;
    place-items: center;
    transition: all 0.15s;
}

.icon-option:hover {
    background: #f3f4f6;
    transform: scale(1.1);
}

.icon-option.active {
    background: #111827;
    border-radius: 50%;
}

.new-list-input {
    flex: 1;
    border: none;
    font-size: 1.1rem;
    font-weight: 600;
    color: #111827;
    background: transparent;
    outline: none;
}

.new-list-input::placeholder {
    color: #9ca3af;
    font-weight: 400;
}

.new-list-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.cancel-btn {
    padding: 10px 20px;
    border-radius: 20px;
    border: 1px solid #e5e7eb;
    background: #fff;
    color: #6b7280;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.cancel-btn:hover {
    background: #f3f4f6;
    color: #111827;
}

.create-btn {
    padding: 10px 24px;
    border-radius: 20px;
    border: none;
    background: #111827;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.create-btn:hover:not(:disabled) {
    background: #1f2937;
}

.create-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}
</style>
