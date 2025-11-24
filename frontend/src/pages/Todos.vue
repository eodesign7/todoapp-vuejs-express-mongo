// cSpell: disable

<script setup lang="ts">
import { onMounted, ref } from "vue";
import Header from "@/components/Header.vue";
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import TodoItem from "@/components/TodoItem.vue";
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
            <section class="intro">
                <div>
                    <p class="eyebrow">Prihlásený používateľ</p>
                    <strong>{{ auth.user?.email }}</strong>
                </div>
                <span class="pill">Dnes {{ new Date().toLocaleDateString("sk-SK") }}</span>
            </section>

            <section class="composer">
                <form class="todo-form" @submit.prevent="createTodo">
                    <BaseInput label="Názov úlohy" v-model="title" />
                    <textarea v-model="description" placeholder="Doplň detaily (voliteľné)"></textarea>
                    <BaseButton size="lg" :disabled="todos.loading">
                        {{ todos.loading ? "Ukladám..." : "Pridať úlohu" }}
                    </BaseButton>
                </form>
                <div v-if="todos.error" class="error">{{ todos.error }}</div>
            </section>

            <section class="todo-stack">
                <transition-group tag="ul" name="fade" class="todo-list">
                    <TodoItem v-for="todo in todos.items" :key="todo._id" :todo="todo" @toggle="toggleTodo"
                        @delete="deleteTodo" />
                </transition-group>

                <div v-if="!todos.items.length" class="empty">
                    Zatiaľ nemáš žiadne úlohy. Pridaj prvú! ✍️
                </div>
            </section>
        </main>
    </div>
</template>

<style scoped>
.todos-container {
    min-height: 100vh;
}

.content {
    max-width: 900px;
    margin: 40px auto;
    padding: 0 20px 60px;
}

.content > section {
    margin-bottom: 32px;
}

.intro {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--stroke);
    padding-bottom: 16px;
}

.eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.3em;
    font-size: 0.75rem;
    color: var(--muted);
    margin-bottom: 6px;
}

.pill {
    border-radius: 999px;
    background: var(--accent-soft);
    color: #4f46e5;
    padding: 6px 16px;
    font-size: 0.85rem;
}

.composer {
    background: var(--surface);
    border-radius: 28px;
    border: 1px solid var(--stroke);
    padding: 28px;
    box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
}

.todo-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

textarea {
    min-height: 90px;
    resize: vertical;
    padding: 14px 16px;
    border-radius: 20px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    background: white;
    font-family: inherit;
    transition: border 0.2s, box-shadow 0.2s;
}

textarea:focus {
    border-color: #9a9ff9;
    outline: none;
    box-shadow: 0 0 0 3px rgba(154, 159, 249, 0.2);
}

.todo-stack {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.todo-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.error {
    color: #dc2626;
    margin-top: 8px;
    text-align: center;
}

.empty {
    border: 1px dashed var(--stroke);
    border-radius: 20px;
    padding: 20px;
    text-align: center;
    color: var(--muted);
    font-style: italic;
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(8px);
}
</style>
