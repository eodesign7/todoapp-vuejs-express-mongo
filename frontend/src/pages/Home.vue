<script setup lang="ts">
import { onMounted } from "vue";

import { ensureAuthenticated } from "@/lib/ensureAuth";
import Header from "@/components/Header.vue";



onMounted(() => {
    ensureAuthenticated();
});

</script>

<template>
    <div class="todos-container">
        <header class="header">
            <Header />
        </header>

        <main class="main-content">
            <div class="todos-wrapper">
                <p class="placeholder">
                    🎉 Úspešne si prihlásený!<br>
                    Tu bude tvoj zoznam todo úloh.
                </p>
            </div>
        </main>
    </div>
</template>

<style scoped>
</style>