import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "./translations.js";

export function createServerI18n(lng = "en") {
  const instance = createInstance();
  instance.use(initReactI18next).init({
    resources,
    lng,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    initImmediate: false,
  });
  return instance;
}
