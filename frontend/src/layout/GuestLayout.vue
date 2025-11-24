<!-- src/layout/GuestLayout.vue -->
<script setup lang="ts"></script>

<template>
    <div class="layout">
        <div class="box">
            <slot />
        </div>
    </div>
</template>

<style scoped>
.layout {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f5f5, #dfe8ff);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
}

.box {
    width: 100%;
    max-width: 420px;
}
</style>
