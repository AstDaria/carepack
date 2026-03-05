import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "./translations";

const stored = localStorage.getItem("carepack_lang");
const fallbackLng = stored || "en";

i18n.use(initReactI18next).init({
  resources,
  lng: fallbackLng,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
