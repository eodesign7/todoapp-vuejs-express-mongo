<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

import { useRouter } from "vue-router";
import GuestLayout from "@/layout/GuestLayout.vue";
import Card from "@/components/Card.vue";
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import { ensureAuthenticated } from "@/lib/ensureAuth";

const email = ref("");
const password = ref("");
const auth = useAuthStore();
const router = useRouter();
const loading = ref(false);
const error = ref("");

const submit = async () => {
    error.value = "";
    loading.value = true;
    try {
        await auth.login(email.value, password.value);
        const ok = await ensureAuthenticated();
        if (ok) router.push("/todos");
    } catch (err: any) {
        error.value = err?.response?.data?.message ?? "Prihlásenie zlyhalo.";
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <GuestLayout>
        <Card>
            <h2>Prihlásenie</h2>

            <form @submit.prevent="submit" class="form">
                <BaseInput label="Email" type="email" v-model="email" />

                <BaseInput label="Heslo" type="password" v-model="password" />

                <BaseButton :disabled="loading">
                    {{ loading ? "Prihlasujem..." : "Prihlásiť" }}
                </BaseButton>
            </form>

            <p v-if="error" class="error">{{ error }}</p>

            <p class="switch">
                Nemáš účet?
                <router-link to="/register">Vytvoriť účet</router-link>
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
    color: var(--primary-color);
    text-decoration: none;
}

.error {
    margin-top: 12px;
    color: #d93025;
    font-size: 0.9rem;
    text-align: center;
}
</style>
