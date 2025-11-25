<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Project, Task } from "@/lib/interfaces";
import TodoItem from "./TodoItem.vue";

const props = defineProps<{
    list: Project;
    tasks: Task[];
    isLoading?: boolean;
}>();

const emit = defineEmits<{
    toggle: [];
    addTodo: [title: string];
    toggleTask: [task: Task];
    deleteTask: [task: Task];
    deleteList: [];
}>();

const isOpen = ref(false);
const newTodoTitle = ref("");
const inputRef = ref<HTMLInputElement | null>(null);

const activeCount = computed(() => props.tasks.filter((t) => t.status === "active").length);
const completedCount = computed(() => props.tasks.filter((t) => t.status === "completed").length);
const totalCount = computed(() => props.tasks.length);

const sortedTasks = computed(() => {
    const active = props.tasks.filter((t) => t.status === "active");
    const completed = props.tasks.filter((t) => t.status === "completed");
    return [...active, ...completed];
});

const listIcon = computed(() => props.list.icon || "📋");

const toggle = () => {
    isOpen.value = !isOpen.value;
    emit("toggle");
};

const handleAddTodo = () => {
    const title = newTodoTitle.value.trim();
    if (title) {
        emit("addTodo", title);
        newTodoTitle.value = "";
    }
};

const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
        handleAddTodo();
    }
};

const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    emit("deleteList");
};

watch(isOpen, (open) => {
    if (open) {
        setTimeout(() => inputRef.value?.focus(), 100);
    }
});
</script>

<template>
    <div class="list-item" :class="{ open: isOpen }">
        <button class="list-header" @click="toggle">
            <div class="list-icon" :style="{ background: list.color || '#f3f4f6' }">
                {{ listIcon }}
            </div>
            <div class="list-info">
                <span class="list-name">{{ list.name }}</span>
                <span v-if="list.description" class="list-desc">{{ list.description }}</span>
            </div>
            <div class="list-actions">
                <div class="list-stats">
                    <span v-if="activeCount > 0" class="stat active">{{ activeCount }}</span>
                    <span v-if="completedCount > 0" class="stat completed">{{ completedCount }} ✓</span>
                </div>
                <button 
                    class="delete-header-btn" 
                    @click="handleDelete"
                    aria-label="Zmazať zoznam"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                </button>
                <svg 
                    class="chevron" 
                    :class="{ rotated: isOpen }"
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="2"
                >
                    <polyline points="6 9 12 15 18 9"/>
                </svg>
            </div>
        </button>

        <div v-if="isOpen" class="list-content">
            <div v-if="isLoading" class="loading-state">
                Načítavam...
            </div>
            
            <template v-else>
                <div class="todos-container">
                    <TodoItem
                        v-for="task in sortedTasks"
                        :key="task._id"
                        :task="task"
                        @toggle="emit('toggleTask', $event)"
                        @delete="emit('deleteTask', $event)"
                    />
                    
                    <div v-if="!tasks.length" class="empty-state">
                        Žiadne úlohy. Pridaj prvú nižšie.
                    </div>
                </div>

                <div class="add-todo-row">
                    <input
                        ref="inputRef"
                        v-model="newTodoTitle"
                        type="text"
                        placeholder="Nová úloha..."
                        class="add-todo-input"
                        @keydown="handleKeydown"
                    />
                    <button 
                        v-if="newTodoTitle.trim()" 
                        class="add-btn"
                        @click="handleAddTodo"
                    >
                        Pridať
                    </button>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
.list-item {
    background: #fff;
    border-radius: 20px;
    border: 1px solid #e5e7eb;
    overflow: hidden;
    transition: box-shadow 0.2s;
}

.list-item:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.list-item.open {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.list-header {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    padding: 16px 20px;
    background: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
    transition: background 0.2s;
}

.list-header:hover {
    background: #f9fafb;
}

.list-icon {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 1.3rem;
    flex-shrink: 0;
}

.list-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.list-name {
    font-weight: 600;
    font-size: 1rem;
    color: #111827;
}

.list-desc {
    font-size: 0.85rem;
    color: #6b7280;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.list-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.list-stats {
    display: flex;
    gap: 6px;
}

.stat {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 20px;
}

.stat.active {
    background: #fef3c7;
    color: #92400e;
}

.stat.completed {
    background: #d1fae5;
    color: #065f46;
}

.delete-header-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: #9ca3af;
    cursor: pointer;
    display: grid;
    place-items: center;
    opacity: 0;
    transition: all 0.2s;
}

.list-header:hover .delete-header-btn {
    opacity: 1;
}

.delete-header-btn:hover {
    background: #fef2f2;
    color: #dc2626;
}

.chevron {
    color: #9ca3af;
    transition: transform 0.2s;
    flex-shrink: 0;
}

.chevron.rotated {
    transform: rotate(180deg);
}

.list-content {
    padding: 0 20px 20px;
    border-top: 1px solid #f3f4f6;
}

.loading-state {
    padding: 20px 0;
    text-align: center;
    color: #6b7280;
}

.todos-container {
    padding: 8px 0;
}

.empty-state {
    padding: 24px 0;
    text-align: center;
    color: #9ca3af;
    font-size: 0.9rem;
}

.add-todo-row {
    display: flex;
    gap: 8px;
    margin-top: 8px;
}

.add-todo-input {
    flex: 1;
    padding: 12px 0;
    border: none;
    font-size: 0.95rem;
    color: #111827;
    background: transparent;
    outline: none;
}

.add-todo-input::placeholder {
    color: #9ca3af;
}

.add-btn {
    padding: 8px 16px;
    border-radius: 20px;
    border: none;
    background: #111827;
    color: #fff;
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    transition: background 0.2s;
}

.add-btn:hover {
    background: #1f2937;
}
</style>
