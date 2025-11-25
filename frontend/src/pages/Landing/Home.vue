<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import AppFooter from "@/components/AppFooter.vue";

const router = useRouter();
const auth = useAuthStore();

onMounted(async () => {
    if (auth.token) {
        try {
            await auth.fetchMe();
            if (auth.isAuthenticated) {
                router.push("/dashboard");
            }
        } catch {
            // Token invalid, stay on home
        }
    }
});

const goToLogin = () => router.push("/login");
const goToRegister = () => router.push("/register");
</script>

<template>
    <div class="home-page">
        <main class="hero">
        <div class="hero-content">
                <div class="logo">
                    <span class="logo-icon">✓</span>
                </div>
                <h1>Todos</h1>
            <p class="subtitle">
                    Jednoduchá správa úloh. Vytváraj zoznamy, pridávaj úlohy, 
                    buď produktívny.
            </p>

            <div class="actions">
                    <button class="btn primary" @click="goToLogin">
                        Prihlásiť sa
                    </button>
                    <button class="btn secondary" @click="goToRegister">
                        Vytvoriť účet
                    </button>
                </div>
            </div>
        </main>
        <AppFooter />
        </div>
</template>

<style scoped>
.home-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(145deg, #f9fafb 0%, #f3f4f6 100%);
}

.hero {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 24px;
}

.hero-content {
    text-align: center;
    max-width: 400px;
}

.logo {
    margin-bottom: 24px;
}

.logo-icon {
    display: inline-grid;
    place-items: center;
    width: 72px;
    height: 72px;
    background: #111827;
    color: #fff;
    border-radius: 20px;
    font-size: 2rem;
    font-weight: 700;
}

h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #111827;
    margin: 0 0 12px;
    letter-spacing: -0.02em;
}

.subtitle {
    font-size: 1.1rem;
    color: #6b7280;
    line-height: 1.6;
    margin: 0 0 32px;
}

.actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.btn {
    padding: 14px 28px;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
}

.btn.primary {
    background: #111827;
    color: #fff;
}

.btn.primary:hover {
    background: #1f2937;
    transform: translateY(-1px);
}

.btn.secondary {
    background: #fff;
    color: #111827;
    border: 1px solid #e5e7eb;
}

.btn.secondary:hover {
    background: #f9fafb;
    border-color: #d1d5db;
}

@media (min-width: 480px) {
    .actions {
        flex-direction: row;
        justify-content: center;
    }
}
</style>
