<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps<{
    email?: string | null;
    role?: string;
}>();

const emit = defineEmits<{
    logout: [];
    settings: [];
}>();

const showMenu = ref(false);

const toggleMenu = (event: MouseEvent) => {
    event.stopPropagation();
    showMenu.value = !showMenu.value;
};

const closeMenu = () => {
    showMenu.value = false;
};

onMounted(() => document.addEventListener("click", closeMenu));
onBeforeUnmount(() => document.removeEventListener("click", closeMenu));

const initials = computed(() => props.email?.[0]?.toUpperCase() ?? "U");

const handleLogout = () => {
    emit("logout");
    closeMenu();
};

const handleSettings = () => {
    emit("settings");
    closeMenu();
};
</script>

<template>
    <div class="user-button">
        <div class="profile-avatar">{{ initials }}</div>
        <div class="profile-info">
            <strong>{{ props.email || "anonymous" }}</strong>
            <small>{{ props.role ?? "Member" }}</small>
        </div>
        <div class="profile-menu" @click.stop>
            <button class="ghost" aria-label="Profil" @click="toggleMenu">⋯</button>
            <div v-if="showMenu" class="dropdown">
                <button type="button" @click="handleSettings">Nastavenia</button>
                <button type="button" class="danger" @click="handleLogout">Odhlásiť</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.user-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 0;
}

.profile-avatar {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: #111827;
    color: #fff;
    display: grid;
    place-items: center;
    font-weight: 600;
}

.profile-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
}

.profile-info strong {
    font-size: 0.95rem;
    color: #0f172a;
}

.profile-info small {
    color: #6b7280;
    font-size: 0.8rem;
}

.profile-menu {
    position: relative;
}

.ghost {
    background: transparent;
    border: none;
    color: #374151;
    cursor: pointer;
    font-size: 1.1rem;
}

.dropdown {
    position: absolute;
    top: 32px;
    right: 0;
    background: #fff;
    border: 1px solid #1f2937;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    min-width: 160px;
    z-index: 20;
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.15);
}

.dropdown button {
    border: none;
    background: transparent;
    padding: 10px 14px;
    text-align: left;
    font-size: 0.9rem;
    color: #1f2937;
    cursor: pointer;
}

.dropdown button:hover {
    background: #f3f4f6;
}

.dropdown button.danger {
    color: #b91c1c;
}
</style>

