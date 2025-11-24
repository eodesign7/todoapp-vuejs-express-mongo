<script setup lang="ts">
import { onMounted } from "vue";
import BaseButton from "@/components/BaseButton.vue";
import { useAuthRedirect } from "@/composables/useAuth";
import { useRouter } from "vue-router";

const router = useRouter();
const { redirectToTodosIfAuthenticated } = useAuthRedirect();

onMounted(() => {
    redirectToTodosIfAuthenticated();
});

const goToLogin = () => router.push("/login");
const goToRegister = () => router.push("/register");
</script>

<template>
    <section class="hero">
        <div class="hero-content">
            <p class="eyebrow">Vue 3 • Pinia • Express • MongoDB</p>
            <h1>Spravuj svoje úlohy ako profík</h1>
            <p class="subtitle">
                Moderná ToDo appka s bezpečnou autentifikáciou a elegantným rozhraním.
            </p>

            <div class="actions">
                <BaseButton class="primary" @click="goToLogin">Prihlásiť sa</BaseButton>
                <BaseButton class="ghost" @click="goToRegister">Vytvoriť účet</BaseButton>
            </div>
        </div>
    </section>
</template>

<style scoped>
.hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(120deg, #fef8f1, #f0f2ff);
    color: #1c1c1c;
    padding: 40px 20px;
    text-align: center;
}

.hero-content {
    max-width: 640px;
    padding: 48px;
    border-radius: 36px;
    background: rgba(255, 255, 255, 0.85);
    border: 1px solid rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(15px);
    box-shadow: 0 30px 70px rgba(15, 23, 42, 0.15);
}

.eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.28em;
    font-size: 0.78rem;
    color: var(--muted);
    margin-bottom: 12px;
}

h1 {
    font-size: clamp(2.8rem, 6vw, 3.8rem);
    margin-bottom: 16px;
}

.subtitle {
    font-size: 1.2rem;
    margin-bottom: 32px;
    color: #5c5c5c;
}

.actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

@media (min-width: 520px) {
    .actions {
        flex-direction: row;
        justify-content: center;
    }
}

.primary {
    background: #111;
    color: white;
}

.ghost {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(0, 0, 0, 0.08);
    color: #111;
}
</style>