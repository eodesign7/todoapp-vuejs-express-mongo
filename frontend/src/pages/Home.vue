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
    background: linear-gradient(120deg, #2a4ad4, #6c63ff);
    color: white;
    padding: 40px 20px;
    text-align: center;
}

.hero-content {
    max-width: 640px;
}

.eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 0.85rem;
    margin-bottom: 12px;
    color: rgba(255, 255, 255, 0.8);
}

h1 {
    font-size: clamp(2.5rem, 6vw, 3.5rem);
    margin-bottom: 16px;
}

.subtitle {
    font-size: 1.2rem;
    margin-bottom: 32px;
    color: rgba(255, 255, 255, 0.9);
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
    background: white;
    color: #2a4ad4;
}

.ghost {
    background: transparent;
    border: 2px solid white;
    color: white;
}
</style>