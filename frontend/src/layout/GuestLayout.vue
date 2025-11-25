<script setup lang="ts">
import { useRouter } from "vue-router";
import AppFooter from "@/components/AppFooter.vue";

const router = useRouter();
const goHome = () => router.push("/");
</script>

<template>
    <div class="layout">
        <header class="guest-header">
            <button class="logo-btn" @click="goHome">
                <span class="logo-icon">✓</span>
                <span class="logo-text">Todos</span>
            </button>
        </header>
        <main class="content">
        <div class="glass">
            <slot />
        </div>
        </main>
        <AppFooter />
    </div>
</template>

<style scoped>
.layout {
    min-height: 100vh;
    background: #f9fafb;
    display: flex;
    flex-direction: column;
}

.guest-header {
    padding: 16px 32px;
    background: #fff;
    border-bottom: 1px solid #e5e7eb;
}

.logo-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 12px;
    transition: background 0.2s;
}

.logo-btn:hover {
    background: #f3f4f6;
}

.logo-icon {
    width: 32px;
    height: 32px;
    background: #111827;
    color: #fff;
    border-radius: 10px;
    display: grid;
    place-items: center;
    font-weight: 700;
    font-size: 1.1rem;
}

.logo-text {
    font-weight: 700;
    font-size: 1.25rem;
    color: #111827;
    letter-spacing: -0.02em;
}

.content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;
}

.glass {
    width: 100%;
    max-width: 420px;
    padding: 40px;
    border-radius: 20px;
    background: #fff;
    border: 1px solid #e5e7eb;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
}

@media (max-width: 480px) {
    .content {
        padding: 20px 16px;
    }

    .glass {
        padding: 28px 24px;
    }
}
</style>
