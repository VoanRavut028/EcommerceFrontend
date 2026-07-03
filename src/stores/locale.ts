// stores/locale.js
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { setLocale, type Locale } from "../i18n/index.ts";

export const useLocaleStore = defineStore("locale", () => {
  const currentLang = ref<Locale>(
    (localStorage.getItem("app-locale") as Locale) || "en",
  );

  const fontClass = computed(() =>
    currentLang.value === "kh" ? "font-khmer" : "font-english",
  );

  function switchLanguage(lang: Locale) {
    currentLang.value = lang;
    setLocale(lang);
  }

  return { currentLang, fontClass, switchLanguage };
});
