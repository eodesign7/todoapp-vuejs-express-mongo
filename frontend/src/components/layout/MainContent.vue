<template>
    <main class="main-shell">
        <slot />
    </main>
</template>

<style scoped>
.main-shell {
    padding: 40px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-height: 100%;
}

@media (max-width: 1024px) {
    .main-shell {
        padding: 24px;
    }
}
</style>

