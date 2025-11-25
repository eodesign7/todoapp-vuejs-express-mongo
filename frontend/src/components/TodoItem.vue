<script setup lang="ts">
import type { Task } from "@/lib/interfaces";

const props = defineProps<{
    task: Task;
}>();

const emit = defineEmits<{
    toggle: [task: Task];
    delete: [task: Task];
}>();

const formatTime = (start?: string, end?: string) => {
    if (!start && !end) return "";
    const format = (iso?: string) => {
        if (!iso) return "";
        const d = new Date(iso);
        return d.toLocaleTimeString("sk-SK", { hour: "2-digit", minute: "2-digit" });
    };
    if (start && end) return `${format(start)} - ${format(end)}`;
    if (start) return `od ${format(start)}`;
    return `do ${format(end)}`;
};
</script>

<template>
    <div class="todo-item" :class="{ completed: task.status === 'completed' }">
        <button 
            class="checkbox" 
            :class="{ checked: task.status === 'completed' }"
            @click="emit('toggle', task)"
            aria-label="Prepnúť stav úlohy"
        >
            <svg v-if="task.status === 'completed'" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
        </button>
        
        <div class="todo-content">
            <span class="todo-title">{{ task.title }}</span>
            <span v-if="task.description || task.startTime || task.endTime" class="todo-meta">
                {{ task.description }}
                <span v-if="task.description && (task.startTime || task.endTime)"> · </span>
                {{ formatTime(task.startTime, task.endTime) }}
            </span>
        </div>

        <button class="delete-btn" @click="emit('delete', task)" aria-label="Zmazať úlohu">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
        </button>
    </div>
</template>

<style scoped>
.todo-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 10px 0;
    transition: opacity 0.2s;
}

.todo-item.completed {
    opacity: 0.5;
}

.todo-item.completed .todo-title {
    text-decoration: line-through;
    color: #9ca3af;
}

.checkbox {
    width: 22px;
    height: 22px;
    min-width: 22px;
    border-radius: 50%;
    border: 2px solid #d1d5db;
    background: #fff;
    cursor: pointer;
    display: grid;
    place-items: center;
    transition: all 0.2s;
    margin-top: 2px;
}

.checkbox:hover {
    border-color: #111827;
    background: #f9fafb;
}

.checkbox.checked {
    background: #111827;
    border-color: #111827;
    color: #fff;
}

.todo-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.todo-title {
    font-size: 0.95rem;
    color: #111827;
    word-break: break-word;
}

.todo-meta {
    font-size: 0.8rem;
    color: #6b7280;
}

.delete-btn {
    width: 28px;
    height: 28px;
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

.todo-item:hover .delete-btn {
    opacity: 1;
}

.delete-btn:hover {
    background: #fef2f2;
    color: #dc2626;
}
</style>
