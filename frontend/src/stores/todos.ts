import { defineStore } from "pinia";
import api from "@/lib/api";
import type { Todo } from "@/lib/interfaces";

interface TodosState {
    items: Todo[];
    loading: boolean;
    error: string | null;
}

export const useTodosStore = defineStore("todos", {
    state: (): TodosState => ({
        items: [],
        loading: false,
        error: null,
    }),

    actions: {
        async fetchTodos() {
            this.loading = true;
            this.error = null;
            try {
                const { data } = await api.get("/todos");
                this.items = data.todos;
            } catch (error: any) {
                this.error = error?.response?.data?.message ?? "Nepodarilo sa načítať úlohy.";
            } finally {
                this.loading = false;
            }
        },

        async addTodo(payload: { title: string; description?: string }) {
            try {
                const { data } = await api.post("/todos", payload);
                this.items.unshift(data.todo);
            } catch (error: any) {
                this.error = error?.response?.data?.message ?? "Úlohu sa nepodarilo vytvoriť.";
            }
        },

        async toggleTodo(id: string) {
            const target = this.items.find((todo) => todo._id === id);
            if (!target) return;

            try {
                const { data } = await api.put(`/todos/${id}`, {
                    completed: !target.completed,
                });
                this.items = this.items.map((todo) => (todo._id === id ? data.todo : todo));
            } catch (error: any) {
                this.error = error?.response?.data?.message ?? "Úlohu sa nepodarilo upraviť.";
            }
        },

        async deleteTodo(id: string) {
            const backup = [...this.items];
            this.items = this.items.filter((todo) => todo._id !== id);

            try {
                await api.delete(`/todos/${id}`);
            } catch (error: any) {
                this.items = backup;
                this.error = error?.response?.data?.message ?? "Úlohu sa nepodarilo zmazať.";
            }
        },
    },
});

