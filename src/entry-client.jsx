import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App.jsx";
import "./i18n/index.js";
import "./styles/index.scss";

const initialPage = window.location.pathname === "/terms" ? "terms" : "main";

hydrateRoot(
  document.getElementById("root"),
  <React.StrictMode>
    <App initialPage={initialPage} />
  </React.StrictMode>,
);
