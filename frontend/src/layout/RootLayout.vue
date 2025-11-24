<script setup lang="ts">
import AppSidebar from "@/components/layout/Sidebar.vue";
import MainContent from "@/components/layout/MainContent.vue";
</script>

<template>
    <div class="root-layout">
        <AppSidebar>
            <slot name="sidebar" />
        </AppSidebar>
        <MainContent>
            <slot />
        </MainContent>
    </div>
</template>

<style scoped>
.root-layout {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 260px 1fr;
    background: #f9fafb;
    color: #111827;
}

@media (max-width: 1024px) {
    .root-layout {
        grid-template-columns: 1fr;
    }
}
</style>

