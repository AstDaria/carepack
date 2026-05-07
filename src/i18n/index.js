import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "./translations";

const stored = typeof window !== "undefined" ? localStorage.getItem("carepack_lang") : null;
const fallbackLng = stored || "en";

i18n.use(initReactI18next).init({
  resources,
  lng: fallbackLng,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
