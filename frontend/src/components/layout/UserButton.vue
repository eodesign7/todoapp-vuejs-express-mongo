<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = withDefaults(
    defineProps<{
        email?: string;
        subtitle?: string;
    }>(),
    { subtitle: "Product Lead" },
);

const emit = defineEmits<{
    logout: [];
}>();

const isOpen = ref(false);

const initials = computed(() => props.email?.[0]?.toUpperCase() ?? "U");

const toggleMenu = (event: MouseEvent) => {
    event.stopPropagation();
    isOpen.value = !isOpen.value;
};

const closeMenu = () => {
    isOpen.value = false;
};

const handleLogout = () => {
    emit("logout");
    closeMenu();
};

onMounted(() => document.addEventListener("click", closeMenu));
onBeforeUnmount(() => document.removeEventListener("click", closeMenu));
</script>

<template>
    <div class="user-button">
        <div class="avatar">{{ initials }}</div>
        <div class="info">
            <strong>{{ email || "anonymous" }}</strong>
            <small>{{ subtitle }}</small>
        </div>
        <div class="menu" @click.stop>
            <button class="menu-trigger" aria-label="Profil" @click="toggleMenu">⋯</button>
            <div v-if="isOpen" class="user-dropdown">
                <button type="button" @click="closeMenu">Settings</button>
                <button type="button" class="danger" @click="handleLogout">Logout</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.user-button {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: #111827;
    color: #fff;
    display: grid;
    place-items: center;
    font-weight: 600;
}

.info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
}

.info strong {
    font-size: 0.95rem;
    color: #0f172a;
}

.info small {
    color: #6b7280;
    font-size: 0.8rem;
}

.menu {
    position: relative;
}

.menu-trigger {
    background: transparent;
    border: none;
    color: #4b5563;
    cursor: pointer;
    font-size: 1.2rem;
}

.user-dropdown {
    position: absolute;
    top: 32px;
    right: 0;
    background: #fff;
    border: 1px solid #1f2937;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    min-width: 160px;
    z-index: 30;
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.15);
}

.user-dropdown button {
    border: none;
    background: transparent;
    padding: 10px 14px;
    text-align: left;
    font-size: 0.9rem;
    color: #1f2937;
    cursor: pointer;
}

.user-dropdown button:hover {
    background: #f3f4f6;
}

.user-dropdown button.danger {
    color: #b91c1c;
}
</style>

