// src/routes/index.ts
import { createRouter, createWebHistory } from "vue-router";
import { ensureAuthenticated } from "@/lib/ensureAuth";

import Home from "@/pages/Home.vue";
import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue";
import Todos from "@/pages/Todos.vue";
import { useAuthStore } from "@/stores/auth";

const routes = [
    { path: "/", name: "Home", component: Home },
    { path: "/register", name: "Register", component: Register },
    { path: "/login", name: "Login", component: Login },
    { path: "/todos", name: "Todos", component: Todos, meta: { requiresAuth: true } },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, _from, next) => {
    const auth = useAuthStore();

    if (to.meta.requiresAuth) {
        const ok = await ensureAuthenticated("/login");
        if (!ok) return;
    }

    if ((to.name === "Login" || to.name === "Register") && auth.isAuthenticated) {
        next({ name: "Todos" });
        return;
    }

    next();
});