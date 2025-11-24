<template>
    <aside class="sidebar-shell">
        <slot />
    </aside>
</template>

<style scoped>
.sidebar-shell {
    background: #f5f5f4;
    border-right: 1px solid #e4e4e7;
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-height: 100%;
}

@media (max-width: 1024px) {
    .sidebar-shell {
        flex-direction: row;
        overflow-x: auto;
    }
}
</style>

