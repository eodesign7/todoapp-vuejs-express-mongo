<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        disabled?: boolean;
        variant?: "default" | "ghost" | "danger";
        size?: "md" | "lg";
    }>(),
    { variant: "default", size: "md" },
);
</script>

<template>
    <button class="btn" :class="[variant, size]" :disabled="disabled" @click="$emit('click')">
        <slot />
    </button>
</template>

<style scoped>
.btn {
    width: 100%;
    padding: 12px 20px;
    font-size: 1rem;
    font-weight: 500;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
    box-shadow: 0 18px 30px rgba(22, 28, 45, 0.18);
    background: #111;
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.btn.lg {
    padding: 14px 24px;
    font-size: 1.05rem;
}

.btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 24px 40px rgba(22, 28, 45, 0.22);
}

.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
}

.btn.ghost {
    background: rgba(255, 255, 255, 0.8);
    color: #111;
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: none;
}

.btn.danger {
    background: #fee2e2;
    color: #b91c1c;
    box-shadow: none;
}
</style>
