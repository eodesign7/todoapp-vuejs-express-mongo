
<script setup lang="ts">
import type { Todo } from "@/lib/interfaces";

interface Emits { 
    (e: 'toggle', id: string): void;
    (e: 'delete', id: string): void;
}

const props = defineProps<{ todo: Todo }>();

const emit = defineEmits<Emits>();

const onToggle = () => emit("toggle", props.todo._id);
const onDelete = () => emit("delete", props.todo._id);
</script>

<template>
    <li :class="{ done: todo.completed }">
        <label class="checkbox">
            <input type="checkbox" :checked="todo.completed" @change="onToggle" />
            <span class="indicator" />
        </label>

        <div class="body">
            <strong>{{ todo.title }}</strong>
            <span v-if="todo.description">{{ todo.description }}</span>
        </div>

        <button class="delete" @click="onDelete">Vymazať</button>
    </li>
</template>

<style scoped>
li {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 18px 22px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 18px;
    background: white;
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
    transition: transform 0.2s, box-shadow 0.2s;
}

li:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
}

li.done {
    opacity: 0.6;
}

.checkbox {
    position: relative;
    width: 26px;
    height: 26px;
    border: 2px solid rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    cursor: pointer;
}

.checkbox input {
    opacity: 0;
    width: 100%;
    height: 100%;
    margin: 0;
}

.indicator {
    position: absolute;
    inset: 3px;
    border-radius: 6px;
    background: transparent;
    transition: background 0.2s;
}

input:checked + .indicator {
    background: #4f61ff;
}

.body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.body span {
    color: var(--muted);
}

.delete {
    border: none;
    background: transparent;
    color: #dc2626;
    cursor: pointer;
    font-weight: 500;
}
</style>