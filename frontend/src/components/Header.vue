<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { router } from "@/routes";
import BaseButton from "@/components/BaseButton.vue";

const auth = useAuthStore();


const logout = () => {
    auth.logout();
    router.push("/login");
 }
</script>

<template>
    <header class="header">
        <div class="header-content">
            <h1>Moje ToDo úlohy</h1>
            <div class="user-info">
                <span v-if="auth.user" class="pill">{{ auth.user.email }}</span>
                <BaseButton class="ghost" @click="logout">Odhlásiť sa</BaseButton>
            </div>
        </div>
    </header>
</template>

<style scoped>
.header {
    position: sticky;
    top: 0;
    backdrop-filter: blur(16px);
    background: rgba(247, 246, 243, 0.85);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    padding: 18px 0;
    z-index: 10;
}

.header-content {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.user-info {
    display: flex;
    align-items: center;
    gap: 16px;
}

.pill {
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.08);
    padding: 6px 16px;
    font-size: 0.9rem;
}

</style>