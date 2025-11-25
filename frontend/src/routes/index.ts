import { createRouter, createWebHistory } from "vue-router";
import { ensureAuthenticated } from "@/lib/ensureAuth";
import { useAuthStore } from "@/stores/auth";

import Home from "@/pages/Landing/Home.vue";
import Login from "@/pages/auth/Login.vue";
import Register from "@/pages/auth/Register.vue";
import Dashboard from "@/pages/Dashboard.vue";

const routes = [
    { path: "/", name: "Home", component: Home },
    { path: "/register", name: "Register", component: Register },
    { path: "/login", name: "Login", component: Login },
    { path: "/dashboard", name: "Dashboard", component: Dashboard, meta: { requiresAuth: true } },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, _from, next) => {
    const auth = useAuthStore();

    if (to.meta.requiresAuth) {
        const ok = await ensureAuthenticated();
        if (!ok) {
            next({ name: "Home" });
            return;
        }
    }

    if (
        (to.name === "Login" || to.name === "Register") &&
        auth.isAuthenticated
    ) {
        next({ name: "Dashboard" });
        return;
    }

    next();
});
