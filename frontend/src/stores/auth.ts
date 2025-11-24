// cSpell: disable

import type { AuthState } from "@/lib/interfaces";
import { defineStore } from "pinia";
import api from "@/lib/api";

export const useAuthStore = defineStore("auth", {
    state: (): AuthState => ({
        user: null,
        token: localStorage.getItem("token") || null,
    }),

    // Added getter for checking if user is authenticated
    getters: {
        isAuthenticated(): boolean { 
            return !!this.token && !!this.user;
        }
    },

    actions: {
        async fetchMe() {
            if (!this.token) return;
            try {
                const res = await api.get("/auth/me");
                this.user = res.data.user;
            } catch (error) {
                // Ak token nie je platný, vymaž ho...
                this.logout();
            }
        },

        async register(email: string, password: string) {
            const res = await api.post("/auth/register", { email, password });
            this.token = res.data.token;
            localStorage.setItem("token", this.token!);
            await this.fetchMe();
        },

        async login(email: string, password: string) {
            const res = await api.post("/auth/login", { email, password });
            this.token = res.data.token;
            localStorage.setItem("token", this.token!);
            await this.fetchMe();
        },

        logout() {
            this.user = null;
            this.token = null;
            localStorage.removeItem("token");
        },
    },
});
