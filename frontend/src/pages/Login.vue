<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

import GuestLayout from "@/layout/GuestLayout.vue";
import AuthCard from "@/components/ui/AuthCard.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseButton from "@/components/ui/BaseButton.vue";

const email = ref("");
const password = ref("");

const auth = useAuthStore();

const submit = async () => {
    await auth.login(email.value, password.value);
};
</script>

<template>
    <GuestLayout>
        <AuthCard>
            <h2>Prihlásenie</h2>

            <form @submit.prevent="submit" class="form">
                <BaseInput label="Email" type="email" v-model="email" />

                <BaseInput label="Heslo" type="password" v-model="password" />

                <BaseButton>Prihlásiť</BaseButton>
            </form>

            <p class="switch">
                Nemáš účet?
                <router-link to="/register">Vytvoriť účet</router-link>
            </p>
        </AuthCard>
    </GuestLayout>
</template>

<style scoped>
.form {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.switch {
    margin-top: 16px;
    font-size: 14px;
    text-align: center;
}

.switch a {
    color: var(--primary-color);
    text-decoration: none;
}
</style>
