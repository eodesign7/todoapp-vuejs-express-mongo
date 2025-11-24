<script setup lang="ts">
import { onMounted, ref } from "vue";
import Header from "@/components/Header.vue";
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import { useTodosStore } from "@/stores/todos";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const todos = useTodosStore();

const title = ref("");
const description = ref("");

const loadData = async () => {
    if (!auth.user && auth.token) {
        await auth.fetchMe();
    }
    await todos.fetchTodos();
};

onMounted(loadData);

const createTodo = async () => {
    if (!title.value.trim()) return;
    await todos.addTodo({
        title: title.value.trim(),
        description: description.value.trim() || undefined,
    });
    title.value = "";
    description.value = "";
};

const toggleTodo = (id: string) => todos.toggleTodo(id);
const deleteTodo = (id: string) => todos.deleteTodo(id);
</script>

<template>
    <div class="todos-container">
        <Header />

        <main class="content">
            <section class="card">
                <header class="card-header">
                    <div>
                        <p class="eyebrow">Prihlásený používateľ</p>
                        <strong>{{ auth.user?.email }}</strong>
                    </div>
                </header>

                <form class="todo-form" @submit.prevent="createTodo">
                    <BaseInput label="Názov úlohy" v-model="title" />
                    <textarea
                        v-model="description"
                        placeholder="Doplň detaily (voliteľné)"
                    ></textarea>
                    <BaseButton :disabled="todos.loading">
                        {{ todos.loading ? "Ukladám..." : "Pridať úlohu" }}
                    </BaseButton>
                </form>

                <div v-if="todos.error" class="error">{{ todos.error }}</div>

                <ul class="todo-list">
                    <li v-for="todo in todos.items" :key="todo._id" :class="{ done: todo.completed }">
                        <label>
                            <input
                                type="checkbox"
                                :checked="todo.completed"
                                @change="toggleTodo(todo._id)"
                            />
                            <span>
                                <strong>{{ todo.title }}</strong>
                                <small v-if="todo.description">{{ todo.description }}</small>
                            </span>
                        </label>

                        <button class="delete" @click="deleteTodo(todo._id)">Vymazať</button>
                    </li>
                    <li v-if="!todos.items.length" class="empty">
                        Zatiaľ nemáš žiadne úlohy. Pridaj prvú!
                    </li>
                </ul>
            </section>
        </main>
    </div>
</template>

<style scoped>
.todos-container {
    min-height: 100vh;
    background: #f5f7fb;
}

.content {
    max-width: 900px;
    margin: 40px auto;
    padding: 0 20px 60px;
}

.card {
    background: white;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 20px 60px rgba(15, 23, 42, 0.12);
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 0.75rem;
    color: #94a3b8;
    margin-bottom: 4px;
}

.todo-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

textarea {
    min-height: 80px;
    resize: vertical;
    padding: 10px 12px;
    border-radius: 6px;
    border: 1px solid #d1d5db;
    font-family: inherit;
}

.todo-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.todo-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
}

.todo-list li.done {
    opacity: 0.6;
}

.todo-list label {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
}

.todo-list strong {
    display: block;
}

.todo-list small {
    color: #64748b;
}

.todo-list .delete {
    border: none;
    background: transparent;
    color: #dc2626;
    cursor: pointer;
}

.todo-list .empty {
    justify-content: center;
    color: #94a3b8;
    font-style: italic;
}

.error {
    color: #dc2626;
    text-align: center;
}
</style>
