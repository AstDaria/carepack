import { useTranslation } from "react-i18next";

const LANGS = [
  { code: "et", label: "ET" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
];

export default function LanguageSwitch() {
  const { i18n } = useTranslation();

  const setLang = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("carepack_lang", lng);
    document.documentElement.lang = lng;
  };

  return (
    <div className="lang-switch" role="group" aria-label="Language switch">
      {LANGS.map((l) => {
        const isActive = i18n.language === l.code;
        return (
          <button
            key={l.code}
            type="button"
            className={`lang-switch__btn ${isActive ? "lang-switch__btn--active" : ""}`}
            onClick={() => setLang(l.code)}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
