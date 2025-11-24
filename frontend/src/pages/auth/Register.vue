<script setup lang="ts">
import GuestLayout from "@/layout/GuestLayout.vue";
import Card from "@/components/Card.vue";
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import { useAuthForm } from "@/composables/useAuth";

const { email, password, loading, error, submit } = useAuthForm("register");
</script>

<template>
    <GuestLayout>
        <Card>
            <h2>Registrácia</h2>

            <form @submit.prevent="submit" class="form">
                <BaseInput label="Email" type="email" v-model="email" />

                <BaseInput label="Heslo" type="password" v-model="password" />

                <BaseButton :disabled="loading">
                    {{ loading ? "Vytváram účet..." : "Vytvoriť účet" }}
                </BaseButton>
            </form>

            <p v-if="error" class="error">{{ error }}</p>

            <p class="switch">
                Máš účet?
                <router-link to="/login">Prihlásiť sa</router-link>
            </p>
        </Card>
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

.error {
    margin-top: 12px;
    color: #d93025;
    font-size: 0.9rem;
    text-align: center;
}
</style>
