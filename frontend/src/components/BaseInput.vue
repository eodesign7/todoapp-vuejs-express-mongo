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
    <div class="input-root">
        <label v-if="label">{{ label }}</label>
        <input
            :type="type"
            :placeholder="placeholder"
            v-model="model"
            class="input"
        />
    </div>
</template>

<style scoped>
.input-root {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

label {
    font-size: 14px;
    color: #333;
}

.input {
    padding: 10px 12px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 6px;
    transition: border-color 0.2s;
}

.input:focus {
    border-color: #555;
    outline: none;
}
</style>
