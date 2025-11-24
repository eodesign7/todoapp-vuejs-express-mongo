// src/routes/index.ts
import { createRouter, createWebHistory } from "vue-router";

import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue";

const routes = [
    { path: "/", component: Login },
    { path: "/register", component: Register },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});
