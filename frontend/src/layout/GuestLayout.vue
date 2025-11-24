<!-- src/layout/GuestLayout.vue -->
<script setup lang=""></script>

<template>
    <div class="layout">
        <div class="box">
            <Slot />
        </div>
        <slot />
    </div>
</template>

<style scoped>
.layout {
    min-height: 100vh;
    background: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.box {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
