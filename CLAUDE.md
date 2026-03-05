# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server with HMR at localhost:5173
npm run build     # Production build to dist/
npm run preview   # Preview production build locally
npx eslint src/   # Run linter
```

No test suite is configured.

## Architecture

**Carepack** is a single-page React marketing site for a professional packing service in Tartu, Estonia. It's client-side only with no backend.

### Key files

- `src/App.jsx` — Entire app UI (single component, ~380 lines). Two "pages" (main + terms) managed via `useState`, no router.
- `src/i18n/translations.js` — All text content for EN/RU/ET, including full Terms & Conditions legal text.
- `src/styles/index.scss` — All styles in one file (~1400 lines), BEM naming, CSS custom properties for theming.
- `src/components/LanguageSwitch.jsx` — Language picker; persists choice to `localStorage` key `carepack_lang`.

### i18n pattern

All visible text goes through `useTranslation` hook from `react-i18next`. Keys use dot notation (e.g., `t("packages.s.title")`). Add new content to all three language objects in `translations.js`.

### Styling conventions

CSS custom properties are defined at `:root` in `index.scss`:
- `--accent` (lime green), `--accent-2` (purple), `--accent-3` (rose)
- `--container: 1160px` max-width
- `--radius: 18px` for cards/buttons

Responsive breakpoint: `@media (max-width: 980px)`.

Scroll-reveal animations use the `.reveal` class — elements animate in when they enter the viewport (JS in `App.jsx` uses `IntersectionObserver`).

### Assets

Icons at `public/icons/*.png` are placeholders — replace with same filenames to update illustrations. Favicons are in `public/favicon/`.
