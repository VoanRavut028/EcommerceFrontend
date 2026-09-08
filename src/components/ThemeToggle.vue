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
    class="flex items-center justify-center cursor-pointer rounded-full p-2 transition-colors dark:hover:!text-text dark:!bg-accent"
  >
    <svg
      v-if="isDark"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
      />
    </svg>

    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.7"
      stroke="currentColor"
      class="h-5 w-5"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
      />
    </svg>
  </button>
</template>
