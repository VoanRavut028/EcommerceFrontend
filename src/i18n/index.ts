import { createI18n } from "vue-i18n";
import en from "./locales/en";
import kh from "./locales/kh";

export type Locale = "en" | "kh";

const savedLocale = (localStorage.getItem("app-locale") as Locale) || "en";

export const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: "en",
  messages: {
    en,
    kh,
  },
});

export function setLocale(locale: Locale) {
  i18n.global.locale.value = locale;
  localStorage.setItem("app-locale", locale);
}
