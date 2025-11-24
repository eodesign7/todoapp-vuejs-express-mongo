<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import Header from "@/components/Header.vue";

const auth = useAuthStore();

onMounted(async () => {
    if (!auth.user && auth.token) {
        await auth.fetchMe();
    }
});
</script>

<template>
    <div class="todos-container">
        <Header />

        <main class="content">
            <section class="card">
                <h2>Moje úlohy</h2>
                <p class="placeholder">
                    TODO zoznam pripravíme v ďalšom kroku. Zatiaľ vidíš, že auth funguje a
                    vieš, kto je prihlásený.
                </p>

                <div class="info">
                    <p>Prihlásený používateľ:</p>
                    <strong>{{ auth.user?.email }}</strong>
                </div>
            </section>
        </main>
    </div>
</template>

<style scoped>
.todos-container {
    min-height: 100vh;
    background: #f6f7fb;
}

.content {
    max-width: 900px;
    margin: 40px auto;
    padding: 0 20px 60px;
}

.card {
    background: white;
    border-radius: 18px;
    padding: 36px;
    box-shadow: 0 25px 70px rgba(15, 23, 42, 0.12);
}

.card h2 {
    margin-bottom: 16px;
    font-size: 1.8rem;
}

.placeholder {
    color: #5f6473;
    margin-bottom: 28px;
}

.info {
    display: inline-flex;
    flex-direction: column;
    gap: 6px;
    background: #eef2ff;
    border-radius: 12px;
    padding: 14px 18px;
    color: #2a3a8f;
}
</style>