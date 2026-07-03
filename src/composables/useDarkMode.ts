// composables/useDarkMode.js
import { ref, watchEffect } from "vue";

const isDark = ref(false);

export function useDarkMode() {
  const init = () => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    isDark.value = saved ? saved === "dark" : prefersDark;
  };

  const toggle = () => {
    isDark.value = !isDark.value;
  };

  watchEffect(() => {
    const root = document.documentElement;
    if (isDark.value) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  });

  return { isDark, toggle, init };
}
