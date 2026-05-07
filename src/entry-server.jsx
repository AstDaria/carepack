import { renderToString } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { createServerI18n } from "./i18n/server.js";
import App from "./App.jsx";

export function render(url, lang = "en") {
  const i18n = createServerI18n(lang);
  return renderToString(
    <I18nextProvider i18n={i18n}>
      <App initialPage={url === "/terms" ? "terms" : "main"} />
    </I18nextProvider>,
  );
}
