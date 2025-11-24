<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";

import GuestLayout from "../layouts/GuestLayout.vue";
import AuthCard from "../components/ui/AuthCard.vue";
import BaseInput from "../components/ui/BaseInput.vue";
import BaseButton from "../components/ui/BaseButton.vue";

const email = ref("");
const password = ref("");

const auth = useAuthStore();

const submit = async () => {
    await auth.register(email.value, password.value);
};
</script>

<template>
    <GuestLayout>
        <AuthCard>
            <h2>Registrácia</h2>

            <form @submit.prevent="submit" class="form">
                <BaseInput label="Email" type="email" v-model="email" />

                <BaseInput label="Heslo" type="password" v-model="password" />

                <BaseButton>Vytvoriť účet</BaseButton>
            </form>

            <p class="switch">
                Máš účet?
                <router-link to="/">Prihlásiť sa</router-link>
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
    color: #2a4ad4;
    text-decoration: none;
}
</style>
