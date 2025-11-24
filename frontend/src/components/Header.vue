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
                    <span v-if="auth.user">{{ auth.user.email }}</span>
                    <BaseButton @click="logout" class="logout-btn">
                        Odhlásiť sa
                    </BaseButton>
                </div>
            </div>
        </header>
</template>

<style scoped>
.header {
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px 0;
}

.header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.user-info {
    display: flex;
    align-items: center;
    gap: 16px;
}

.user-info span {
    color: #666;
    font-size: 0.9rem;
}

.logout-btn {
    background-color: #dc3545;
    color: white;
    padding: 8px 16px;
}

</style>