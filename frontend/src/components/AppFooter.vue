<script setup lang="ts">
const techStack = ["VueJS", "Vite", "Node", "Express", "MongoDB", "TypeScript"];
</script>

<template>
    <footer class="app-footer">
        <div class="tech-stack">
            <span v-for="(tech, index) in techStack" :key="tech" class="tech-item">
                {{ tech }}
                <span v-if="index < techStack.length - 1" class="separator">•</span>
            </span>
        </div>
        <div class="credits">
            created by 
            <a href="https://eodev.io" target="_blank" rel="noopener noreferrer" class="author-link">
                eoDev
            </a>
        </div>
    </footer>
</template>

<style scoped>
.app-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 24px 32px;
    background: #fff;
    border-top: 1px solid #e5e7eb;
    margin-top: auto;
}

.tech-stack {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px;
    font-size: 0.8rem;
    color: #6b7280;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.tech-item {
    display: flex;
    align-items: center;
    gap: 4px;
}

.separator {
    color: #d1d5db;
}

.credits {
    font-size: 0.85rem;
    color: #9ca3af;
}

.author-link {
    color: #111827;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s;
}

.author-link:hover {
    color: #4f46e5;
}

@media (max-width: 640px) {
    .app-footer {
        padding: 20px 16px;
    }
}
</style>

