<script setup lang="ts">
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";

const props = defineProps<{
    searchQuery?: string;
}>();

const emit = defineEmits<{
    "update:searchQuery": [value: string];
    quickAdd: [];
}>();
</script>

<template>
    <div class="app-layout">
        <AppHeader 
            :search-query="searchQuery ?? ''"
            @update:search-query="emit('update:searchQuery', $event)"
            @quick-add="emit('quickAdd')"
        />
        <main class="main-content">
            <slot />
        </main>
        <AppFooter />
    </div>
</template>

<style scoped>
.app-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f9fafb;
}

.main-content {
    flex: 1;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 32px 24px;
}

@media (max-width: 640px) {
    .main-content {
        padding: 20px 16px;
    }
}
</style>

