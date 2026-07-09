// composables/useDarkMode.js
import { ref, watch } from "vue";

const THEME_KEY = "theme";
const savedTheme =
  typeof window !== "undefined" ? localStorage.getItem(THEME_KEY) : null;
const prefersDark =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-color-scheme: dark)").matches
    : false;

const isDark = ref(savedTheme ? savedTheme === "dark" : prefersDark);

export function useDarkMode() {
  const init = () => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) {
      isDark.value = saved === "dark";
    }
  };

  const toggle = () => {
    isDark.value = !isDark.value;
  };

  watch(
    isDark,
    (value) => {
      if (typeof document === "undefined") return;

      const root = document.documentElement;

      if (value) {
        root.classList.add("dark");
        localStorage.setItem(THEME_KEY, "dark");
      } else {
        root.classList.remove("dark");
        localStorage.setItem(THEME_KEY, "light");
      }
    },
    { immediate: true },
  );

  return { isDark, toggle, init };
}
