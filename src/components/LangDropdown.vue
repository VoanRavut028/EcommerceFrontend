<script setup lang="ts">
import { computed } from "vue";
import { useLocaleStore } from "@/stores/locale.ts";
import type { Locale } from "@/i18n/index.ts";

const localeStore = useLocaleStore();

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
  const selected = languages.find(
    (language) => language.code === localeStore.currentLang,
  );
  return selected ?? defaultLanguage;
});

const displayedLanguage = computed((): Language => {
  const nextLanguageCode = currentLanguage.value.code === "en" ? "kh" : "en";
  const selected = languages.find(
    (language) => language.code === nextLanguageCode,
  );
  return selected ?? defaultLanguage;
});

const toggleLanguage = () => {
  const nextLanguage = localeStore.currentLang === "en" ? "kh" : "en";
  localeStore.switchLanguage(nextLanguage as Locale);
};
</script>

<template>
  <button
    type="button"
    @click="toggleLanguage"
    class="flex items-center cursor-pointer justify-center p-2 transition-colors"
    :aria-label="`Switch language to ${displayedLanguage.name}`"
  >
    <img
      :src="`https://flagcdn.com/w40/${displayedLanguage.flag}.png`"
      :alt="displayedLanguage.name"
      class="h-5 w-7 object-cover ring-1 ring-gray-300"
    />
  </button>
</template>
