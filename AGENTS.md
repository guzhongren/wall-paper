# AGENTS.md — Wall-Paper

Mapbox-based wallpaper generator. Pick a device model, orientation, and resolution, then export the current map view as a PNG.

## Quick Start

```bash
pnpm install   # install dependencies
pnpm dev       # dev server → http://localhost:5173
pnpm test      # vitest
pnpm build     # production build → build/
```

## Architecture

```
src/
├── index.tsx              # entry — createRoot with StrictMode
├── stores/
│   └── exporterStore.ts   # Zustand store: model/direction/resolution/dimensions state
├── containers/
│   └── WallPaper/         # main page: Mapbox GL init, dimension state
│       ├── index.tsx      #   map instance + window resize handling
│       └── index.scss     #   map container styles
├── components/
│   ├── Exporter/          # export settings panel (Ant Design Card + Tabs)
│   │   ├── index.tsx      #   Tab wrapper, download button → canvas.toDataURL
│   │   └── index.scss     #   float panel styles
│   └── Template/          # device preset form (model, direction, resolution)
│       └── index.tsx      #   Ant Design Form → useExporterStore actions
└── utils/
    └── mm2px.ts           # mm → px conversion: mm / 25.4 * (devicePixelRatio * 96)
```

**Data flow**: User changes settings in `Template` form → calls `useExporterStore` actions → `WallPaper` reads dimensions from Zustand store → recalculates map container size. On "Download", `mapInstance.getCanvas().toDataURL()` captures the Mapbox canvas as a PNG.

## Tech Stack

| Layer | Choice |
|-------|--------|
| UI | React 19, TypeScript 5 |
| State | Zustand 5 |
| Map | Mapbox GL JS |
| Components | Ant Design 5 |
| Styles | SCSS (sass/Dart Sass) |
| Bundler | Vite 6 |
| Tests | Vitest + @testing-library/react |
| Lint/Fmt | oxlint + oxfmt |
| PM | pnpm |
| CI/CD | GitHub Actions → gh-pages deploy |

## Testing

- **Framework**: Vitest (configured in `vite.config.ts` → `test`)
- **Setup**: `tests/setupTests.ts` (jest-dom/vitest matchers)
- **Pattern**: snapshot tests via `asFragment().toMatchSnapshot()`; DOM queries via `getByLabelText`
- **No Provider needed**: Zustand stores are self-contained, no wrapper required in tests
- **CI runs**: `pnpm test` then `pnpm build` on every push/PR to master

## Key Conventions

- **File structure**: one component per directory (`ComponentName/index.tsx` + styles)
- **State**: Zustand `create` with `set()` — mutations via function form of set for derived state
- **Dimensions**: PC model uses pixel values directly; mobile models store mm values and convert via `mm2px()`
- **Mapbox token**: hardcoded in `WallPaper/index.tsx` (public token, fine for client-side)
- **mapInstance**: exposed on `window.mapInstance` for the download flow (`getCanvas().toDataURL()`)

## CI/CD

GitHub Actions (`.github/workflows/node.js.yml`):
1. `pnpm install --frozen-lockfile`
2. `pnpm test` — Vitest suite
3. `pnpm build` — tsc + vite build
4. Deploy `build/` to `gh-pages` branch via `peaceiris/actions-gh-pages@v3`

## Useful Commands

```bash
pnpm dev          # Vite dev server with HMR
pnpm build        # tsc type-check + Vite production build
pnpm test         # vitest run
pnpm test:watch   # vitest watch mode
pnpm ci           # vitest run --update (update snapshots)
pnpm lint         # oxlint src
pnpm fmt          # oxfmt src
```
