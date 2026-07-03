<!-- components/ThemeToggle.vue -->
<script setup>
import { onMounted } from "vue";
import { useDarkMode } from "../composables/useDarkMode";

const { isDark, toggle, init } = useDarkMode();

onMounted(() => {
  init();
});
</script>

<template>
  <button
    @click="toggle"
    aria-label="Toggle dark mode"
    class="rounded-lg px-3 py-2 bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100 transition-colors duration-200"
  >
    <span v-if="isDark">☀️</span>
    <span v-else>🌙</span>
  </button>
</template>
