<script setup lang="ts"></script>

<template>
    <div class="layout">
        <div class="glass">
            <slot />
        </div>
    </div>
</template>

<style scoped>
.layout {
    min-height: 100vh;
    background: linear-gradient(120deg, #f0f2ff, #fdf2f8);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;
}

.glass {
    width: 100%;
    max-width: 460px;
    padding: 48px;
    border-radius: 28px;
    background: rgba(255, 255, 255, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 20px 60px rgba(15, 23, 42, 0.15);
    backdrop-filter: blur(15px);
}
</style>

