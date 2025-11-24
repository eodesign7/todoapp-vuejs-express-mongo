<script setup lang="ts">
defineProps<{
    disabled?: boolean;
}>();
</script>

<template>
    <button class="btn" :disabled="disabled" @click="$emit('click')">
        <slot />
    </button>
</template>

<style scoped>
.btn {
    width: 100%;
    padding: 10px 14px;
    font-size: 16px;
    background: var(--neutral-900);
    color: var(--neutral-100);
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s;
}

.btn:hover {
    background: var(--neutral-800);
}

.btn:disabled {
    background: var(--neutral-500);
    cursor: default;
}
</style>
