# Café Management System

A portable business management system for small service-based businesses such as printing, photocopying, typing, graphics design, and computer services.

## Architecture

This project uses a clean ports-and-adapters design:

- `src/lib/api/contracts` defines abstract repository interfaces.
- `src/lib/api/providers` contains adapters for Apps Script, REST, Firebase, and mock data.
- `src/lib/api/factory.ts` selects the provider at runtime via `VITE_API_PROVIDER`.
- `src/lib/api/index.ts` exports a single `api` instance for the UI.

## API Provider Defaults

- `mock` — default for local development (`.env.development`)
- `apps-script` — default for production (`.env.production`)
- `rest` — for future HTTP backend deployments
- `firebase` — placeholder for future Firebase migration

## Setup

Install dependencies:

```bash
pnpm install
```

Start development:

```bash
pnpm dev
```

Build production:

```bash
pnpm build
```

Build and copy to Apps Script:

```bash
pnpm run build:apps-script
```

## Usage

Import the shared API entrypoint from Svelte components or stores:

```ts
import { api } from "$lib/api";

const products = await api.getProducts();
```

The UI layer should remain infrastructure-agnostic, with no direct calls to `google.script.run`, `fetch`, or Firebase APIs.

## Notes

- This codebase is designed for a modular service-management product that can be sold to different customers.
- The current setup supports Apps Script and mock providers today, with REST and Firebase ready for future migration.
