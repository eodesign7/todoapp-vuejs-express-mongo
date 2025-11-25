<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const props = defineProps<{
    searchQuery: string;
}>();

const emit = defineEmits<{
    "update:searchQuery": [value: string];
    quickAdd: [];
}>();

const auth = useAuthStore();
const router = useRouter();

const quickAddInput = ref("");
const showQuickAdd = ref(false);

const handleLogout = () => {
    auth.logout();
    router.push("/");
};

const goHome = () => {
    router.push("/");
};

const toggleQuickAdd = () => {
    showQuickAdd.value = !showQuickAdd.value;
    if (!showQuickAdd.value) {
        quickAddInput.value = "";
    }
};

const submitQuickAdd = () => {
    if (quickAddInput.value.trim()) {
        emit("quickAdd");
    }
    showQuickAdd.value = false;
    quickAddInput.value = "";
};
</script>

<template>
    <header class="app-header">
        <div class="header-left">
            <button class="logo-btn" @click="goHome" aria-label="Domov">
                <span class="logo-icon">✓</span>
                <span class="logo-text">Todos</span>
            </button>
        </div>

        <div class="header-center">
            <div class="search-box">
                <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                    type="text"
                    placeholder="Hľadať úlohy..."
                    :value="searchQuery"
                    @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
                />
            </div>
        </div>

        <div class="header-right">
            <button class="action-btn" @click="$emit('quickAdd')" aria-label="Pridať list">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 5v14M5 12h14"/>
                </svg>
            </button>
            
            <button class="action-btn logout" @click="handleLogout" aria-label="Odhlásiť sa">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
            </button>
        </div>
    </header>
</template>

<style scoped>
.app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 32px;
    background: #fff;
    border-bottom: 1px solid #e5e7eb;
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-left {
    display: flex;
    align-items: center;
}

.logo-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 12px;
    transition: background 0.2s;
}

.logo-btn:hover {
    background: #f3f4f6;
}

.logo-icon {
    width: 32px;
    height: 32px;
    background: #111827;
    color: #fff;
    border-radius: 10px;
    display: grid;
    place-items: center;
    font-weight: 700;
    font-size: 1.1rem;
}

.logo-text {
    font-weight: 700;
    font-size: 1.25rem;
    color: #111827;
    letter-spacing: -0.02em;
}

.header-center {
    flex: 1;
    max-width: 480px;
    margin: 0 24px;
}

.search-box {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 10px 16px;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.search-box:focus-within {
    border-color: #111827;
    box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.08);
}

.search-icon {
    color: #9ca3af;
    flex-shrink: 0;
}

.search-box input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 0.95rem;
    color: #111827;
    outline: none;
}

.search-box input::placeholder {
    color: #9ca3af;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 8px;
}

.action-btn {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    background: #fff;
    color: #374151;
    cursor: pointer;
    display: grid;
    place-items: center;
    transition: all 0.2s;
}

.action-btn:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
}

.action-btn.logout:hover {
    background: #fef2f2;
    border-color: #fecaca;
    color: #dc2626;
}

@media (max-width: 768px) {
    .app-header {
        padding: 12px 16px;
    }

    .header-center {
        display: none;
    }

    .logo-text {
        display: none;
    }
}
</style>

