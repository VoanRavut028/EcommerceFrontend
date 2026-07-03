<script setup lang="ts">
import { useLocaleStore } from "@/stores/locale.ts";
import { ref, computed, onMounted, onUnmounted } from "vue";
import type { Locale } from "@/i18n/index.ts";

const localeStore = useLocaleStore();
const langMenuOpen = ref<boolean>(false);
const langMenuRef = ref<HTMLElement | null>(null);

interface Language {
  code: Locale;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: "en", name: "English", flag: "us" },
  { code: "kh", name: "ខ្មែរ", flag: "kh" },
];

const defaultLanguage = languages[0] as Language;

const currentLanguage = computed((): Language => {
  const selected = languages.find((l) => l.code === localeStore.currentLang);
  return selected ?? defaultLanguage;
});

const setLanguage = (code: Locale): void => {
  localeStore.switchLanguage(code);
  langMenuOpen.value = false;
};

const handleClickOutside = (e: MouseEvent) => {
  if (langMenuRef.value && !langMenuRef.value.contains(e.target as Node)) {
    langMenuOpen.value = false;
  }
};

onMounted(() => document.addEventListener("click", handleClickOutside));
onUnmounted(() => document.removeEventListener("click", handleClickOutside));
</script>

<template>
  <div class="relative" ref="langMenuRef">
    <button
      @click="langMenuOpen = !langMenuOpen"
      class="flex items-center gap-1.5 text-sm dark:hover:bg-surface-100"
    >
      <img
        :src="`https://flagcdn.com/w40/${currentLanguage.flag}.png`"
        :alt="currentLanguage.name"
        class="w-7 h-5 object-cover ring-1 ring-gray-400"
      />
      <span class="hidden sm:inline font-semibold dark:text-foreground">
        {{ currentLanguage.code.toUpperCase() }}
      </span>
      <svg
        class="w-3.5 h-3.5 text-gray-400 transition-transform"
        :class="{ 'rotate-180': langMenuOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
    <div
      v-if="langMenuOpen"
      class="absolute right-0 top-full mt-1 w-27 bg-white dark:bg-surface-800 rounded-md shadow-card-lg border border-gray-100 dark:border-surface-700 overflow-hidden z-50"
    >
      <button
        v-for="lang in languages"
        :key="lang.code"
        @click="setLanguage(lang.code)"
        class="cursor-pointer w-full flex items-center gap-2.5 px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-700 transition-colors"
        :class="{
          'font-semibold bg-gray-200 dark:bg-surface-100':
            localeStore.currentLang === lang.code,
        }"
      >
        <img
          :src="`https://flagcdn.com/w40/${lang.flag}.png`"
          class="w-7 h-5 object-cover ring-1 ring-gray-400"
          :alt="lang.name"
        />
        <span class="font-sans">{{ lang.code.toUpperCase() }}</span>
      </button>
    </div>
  </div>
</template>
