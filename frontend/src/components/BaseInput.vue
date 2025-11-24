<script setup lang="ts">
import { computed } from "vue";

interface Props {
    modelValue: string;
    label?: string;
    type?: string;
    placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
    type: "text",
});

const emit = defineEmits(["update:modelValue"]);

const model = computed({
    get: () => props.modelValue,
    set: (v) => emit("update:modelValue", v),
});
</script>

<template>
    <label class="input-root">
        <span v-if="label">{{ label }}</span>
        <input
            :type="type"
            :placeholder="placeholder"
            v-model="model"
            class="input"
        />
    </label>
</template>

<style scoped>
.input-root {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 0.9rem;
    color: var(--text-muted);
}

.input {
    padding: 12px 14px;
    font-size: 1rem;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 16px;
    background: #fff;
    transition: border-color 0.15s, box-shadow 0.15s;
}

.input:focus {
    border-color: #9a9ff9;
    outline: none;
    box-shadow: 0 0 0 3px rgba(154, 159, 249, 0.25);
}
</style>
