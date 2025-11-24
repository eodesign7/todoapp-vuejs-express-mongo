<script setup lang="ts"></script>

<template>
    <div class="card">
        <slot />
    </div>
</template>

<style scoped>
.card {
    width: 360px;
    padding: 32px;
    border-radius: 12px;
    background: white;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
}
</style>
