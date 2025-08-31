<p align="center">
	<img src="src/assets/pokeball.svg" alt="Pokedex" width="72" height="72" />
</p>

<h1 align="center">Pokedex</h1>

<p align="center">
	<img alt="version" src="https://img.shields.io/badge/version-0.1.0-blue" />
	<img alt="coverage" src="https://img.shields.io/badge/coverage-+90-brightgreen" />
	<a href="https://github.com/euaaron/pokedex/actions/workflows/deploy.yml">
		<img alt="deploy" src="https://github.com/euaaron/pokedex/actions/workflows/deploy.yml/badge.svg" />
	</a>
	<a href="https://github.com/euaaron/pokedex/actions">
		<img alt="build" src="https://img.shields.io/github/actions/workflow/status/euaaron/pokedex/deploy.yml?branch=main&label=build" />
	</a>
</p>

## What this app does

An interactive Pokédex built with Vue 3 and Vite:
- Loads the Kanto Pokédex and renders Pokémon as themed cards.
- Infinite scroll: shows items in batches and loads more as you reach the end.
- Each card is color-themed from species color and shows the sprite and Dex number.
- Plays the Pokémon cry on hover/focus with a global mute toggle.
- Deployed to GitHub Pages via GitHub Actions.

## How to run

Prerequisites:
- Node.js 20+
- Yarn (recommended)

Install and start dev server:

```powershell
yarn
yarn dev
```

Run tests and coverage:

```powershell
yarn test
yarn coverage
```

Build and preview production:

```powershell
yarn build
yarn preview
```

## Tech stack

- Vue 3 (Composition API, SFCs) – https://vuejs.org/
- Vite – https://vite.dev/
- TypeScript – https://www.typescriptlang.org/
- Vitest – https://vitest.dev/
- Vue Test Utils – https://test-utils.vuejs.org/
- SWRV (stale‑while‑revalidate for Vue) – https://github.com/Kong/swrv
- Axios – https://axios-http.com/
- Sass – https://sass-lang.com/
- GitHub Actions – https://github.com/features/actions
- GitHub Pages – https://pages.github.com/

Deployment is configured via `.github/workflows/deploy.yml`.

## TODO

- [ ] Details page for each Pokémon with richer data (stats, abilities, moves).
- [ ] Sorting and filtering by type, region, generation, name, evolution line, or Dex ID.
- [ ] Matchup guide explaining which Pokémon are strong/weak against others (type effectiveness).
- [ ] Search with autocomplete for quick navigation.
- [ ] Persist mute preference and UI settings (localStorage).
- [ ] Preload next batch on fast networks for smoother scrolling.

## Author

<a href="htps://github.com/euaaron" title="Aaron"><img src="https://github.com/euaaron.png" width="64px" alt="Aaron's github pofile picture"/></a>
